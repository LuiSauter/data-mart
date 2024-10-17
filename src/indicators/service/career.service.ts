import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareerEntity } from '../entities/career.entity';
import { CreateCareerDto } from '../dto/create-career.dto';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { FacultyService } from './faculty.service';
import { handlerError } from 'src/common/utils/handler-error.utils';
import { FilterIndicatorCareerDto } from '../dto/filter-indicator-career.dto';

@Injectable()
export class CareerService {
    private readonly logger = new Logger('CareerService');

    constructor(
        @InjectRepository(CareerEntity)
        private readonly careerRepository: Repository<CareerEntity>,
        private readonly facultyService: FacultyService,
    ) { }

    async create(createCareerDto: CreateCareerDto): Promise<CareerEntity> {
        try {
            const { facultyId, ...careerRest } = createCareerDto;
            const faculty = await this.facultyService.findOne(facultyId);

            if (!faculty) {
                throw new NotFoundException('Faculty not found');
            }

            const career = this.careerRepository.create({
                ...careerRest,
                faculty,
            });

            return await this.careerRepository.save(career);
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to create career');
        }
    }

    async findAll(): Promise<ResponseGet> {
        try {
            const [data, countData] = await this.careerRepository.findAndCount({
                relations: ['faculty'],
            });
            return { data, countData };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve careers');
        }
    }

    async findOne(id: string): Promise<CareerEntity> {
        try {
            const career = await this.careerRepository.findOne({
                where: { id },
                relations: ['faculty'],
            });
            if (!career) throw new NotFoundException('Career not found');
            return career;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve career');
        }
    }

    async findOneByName(name: string): Promise<CareerEntity | null> {
        try {
            const career = await this.careerRepository.findOne({
                where: { name },
                relations: ['faculty'],
            });
            if (!career) return null;
            return career;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve career');
        }
    }

    async update(id: string, createCareerDto: CreateCareerDto): Promise<CareerEntity> {
        try {
            const { facultyId, ...careerRest } = createCareerDto;
            const faculty = await this.facultyService.findOne(facultyId);

            if (!faculty) throw new NotFoundException('Faculty not found');

            await this.careerRepository.update(id, {
                ...careerRest,
                faculty,
            });

            return this.findOne(id);
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to update career');
        }
    }

    async remove(id: string): Promise<ResponseMessage> {
        try {
            const result = await this.careerRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException('Career not found');
            }
            return { statusCode: 200, message: 'Career deleted' };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to delete career');
        }
    }

    public async getCareerWithIndicatorSum(filterDto: FilterIndicatorCareerDto): Promise<any> {
        const { localidadName, facultyName, modeName, semesterPeriod, semesterYear, indicatorAttributes } = filterDto;
        
        const attributeLabels = {
            sum_t_inscritos: 'Estudiantes inscritos',
            sum_t_nuevos: 'Estudiantes nuevos inscritos',
            sum_t_antiguos: 'Estudiantes antiguos',
            sum_matriculas_inscritas: 'Matriculas inscritas',
            sum_sin_nota: 'Estudiantes sin nota',
            sum_aprobados: 'Estudiantes que aprobaron',
            avg_aprobados_percent: 'Porcentaje de estudiantes que aprobaron',
            sum_reprobados: 'Estudiantes que reprobaron',
            avg_reprobados_percent: 'Porcentaje de estudiantes que reprobaron',
            sum_reprobados_con_0: 'Estudiantes que reprobaron con 0 de nota',
            avg_reprobados_con_0_percent: 'Porcentaje de estudiantes que reprobaron con 0 de nota',
            sum_moras: 'Estudiantes en mora',
            avg_moras_percent: 'Porcentaje de estudiantes en mora',
            sum_retirados: 'Estudiantes que retiraron',
            avg_ppa: 'Promedio ponderado acumulado',
            avg_pps: 'Promedio ponderado semestral',
            avg_ppa1: 'Promedio ponderado acumulado sin cero de la carrera',
            avg_ppac: 'Promedio ponderado acumulado de la carrera   ',
            sum_egresados: 'Cantidad de estudiantes egresados',
            sum_titulados: 'Cantidad de estudiantes titulados',
        };

        const query = this.careerRepository
            .createQueryBuilder('career')
            .leftJoin('career.faculty', 'faculty')
            .leftJoin('career.indicators', 'indicator')
            .leftJoin('indicator.locality', 'locality')
            .leftJoin('indicator.mode', 'mode')
            .leftJoin('indicator.semester', 'semester')
            .select('career.name', 'careerName');

        if (indicatorAttributes) {
            const attributesArray = Array.isArray(indicatorAttributes) ? indicatorAttributes : [indicatorAttributes];

            attributesArray.forEach((attribute) => {
                if (attribute.endsWith('percent') || attribute.startsWith('pp')) {
                    query.addSelect(`ROUND(AVG(indicator.${attribute}), 2)`, `avg_${attribute}`);
                } else {
                    query.addSelect(`SUM(indicator.${attribute})`, `sum_${attribute}`);
                }
            });
        }

        query.groupBy('career.name');

        if (localidadName) {
            query.andWhere('locality.name = :localidadName', { localidadName });
        }

        if (facultyName) {
            query.andWhere('faculty.name = :facultyName', { facultyName });
        }

        if (modeName) {
            query.andWhere('mode.name = :modeName', { modeName });
        }

        if (semesterPeriod && semesterYear) {
            query.andWhere('semester.period = :semesterPeriod', { semesterPeriod });
            query.andWhere('semester.year = :semesterYear', { semesterYear });
        }

        try {
            const results = await query.getRawMany();
            
            return results.map(result => {
                const values = [];
                
                Object.keys(result).forEach(key => {
                    if (key.startsWith('avg_') || key.startsWith('sum_')) {
                        
                        const attributeLabel = attributeLabels[key] || key;

                        values.push({
                            label: attributeLabel,
                            value: result[key] 
                        });
                    }
                });

                return {
                    label: result.careerName,
                    values: values
                };
            });
        } catch (error) {
            this.logger.error('Failed to get careers with indicator sum', error.stack);
            throw new Error('Failed to get careers with indicator sum');
        }
    }    
}
