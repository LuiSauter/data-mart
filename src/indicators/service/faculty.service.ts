import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultyEntity } from '../entities/faculty.entity';
import { CreateFacultyDto } from '../dto/create-faculty.dto';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { handlerError } from 'src/common/utils/handler-error.utils';
import { FilterIndicatorFacultyDto } from '../dto/filter-indicator-faculty.dto';

@Injectable()
export class FacultyService {
    private readonly logger = new Logger('FacultyService');

    constructor(
        @InjectRepository(FacultyEntity)
        private readonly facultyRepository: Repository<FacultyEntity>,
    ) { }

    public async create(createFacultyDto: CreateFacultyDto): Promise<FacultyEntity> {
        try {
            const faculty = this.facultyRepository.create(createFacultyDto);
            return await this.facultyRepository.save(faculty);
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to create faculty');
        }
    }

    public async findAll(): Promise<ResponseGet> {
        try {
            const [data, countData] = await this.facultyRepository.findAndCount();
            return { data, countData };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve faculties');
        }
    }

    public async findOne(id: string): Promise<FacultyEntity> {
        try {
            const faculty = await this.facultyRepository.findOne({ where: { id } });
            if (!faculty) throw new NotFoundException('Faculty not found');
            return faculty;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve faculty');
        }
    }

    public async findOneByName(name: string): Promise<FacultyEntity | null> {
        try {
            const faculty = await this.facultyRepository.findOne({ where: {name}});
            if(!faculty) return null;
            return faculty;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Falied to retrieve career');
        }
    }

    public async update(id: string, createFacultyDto: CreateFacultyDto): Promise<FacultyEntity> {
        try {
            await this.facultyRepository.update(id, createFacultyDto);
            return this.findOne(id);
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to update faculty');
        }
    }

    public async remove(id: string): Promise<ResponseMessage> {
        try {
            const result = await this.facultyRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException('Faculty not found');
            }
            return { statusCode: 200, message: 'Faculty deleted' };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to delete faculty');
        }
    }

    public async getFacultyWithIndicatorSum(filterDto: FilterIndicatorFacultyDto): Promise<any> {
        const { localidadName, modeName, semesterPeriod, semesterYear, indicatorAttributes } = filterDto;
        
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

        const query = this.facultyRepository
            .createQueryBuilder('faculty')
            .leftJoin('faculty.careers', 'career')
            .leftJoin('career.indicators', 'indicator')
            .leftJoin('indicator.semester', 'semester')            
            .leftJoin('indicator.locality', 'locality')
            .leftJoin('indicator.mode', 'mode')
            .select('faculty.name', 'facultyName');
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

        query.groupBy('faculty.name');

        if (localidadName) {
            query.andWhere('locality.name = :localidadName', { localidadName });
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
                    const attributeLabel = attributeLabels[key] || key;

                    if (key.startsWith('avg_') || key.startsWith('sum_')) {
                        values.push({
                            label: attributeLabel,
                            value: result[key]
                        });
                    }
                });

                return {
                    label: result.facultyName, 
                    values: values            
                };
            });
        } catch (error) {
            this.logger.error('Failed to get faculties with indicator sum', error.stack);
            throw new Error('Failed to get faculties with indicator sum');
        }
    }
}
