import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemesterEntity } from '../entities/semester.entity';
import { CreateSemesterDto } from '../dto/create-semester.dto';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { handlerError } from 'src/common/utils/handler-error.utils';
import { FilterIndicatorSemesterDto } from '../dto/filter-indicator-semester.dto';

@Injectable()
export class SemesterService {
    private readonly logger = new Logger('SemesterService');

    constructor(
        @InjectRepository(SemesterEntity)
        private readonly semesterRepository: Repository<SemesterEntity>,
    ) { }

    public async create(createSemesterDto: CreateSemesterDto): Promise<SemesterEntity> {
        try {
            const { period, year } = createSemesterDto;
            const semestFound = await this.findOneByPeriodandYear(period, year);
            if (semestFound) {
                throw new Error('Semester already exists');
            }
            const semester = this.semesterRepository.create(createSemesterDto);
            return await this.semesterRepository.save(semester);
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to create semester');
        }
    }

    public async findAll(): Promise<ResponseGet> {
        try {
            const [data, countData] = await this.semesterRepository.findAndCount();
            return { data, countData };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve semesters');
        }
    }

    public async findOne(id: string): Promise<SemesterEntity> {
        try {
            const semester = await this.semesterRepository.findOne({ where: { id } });
            if (!semester) throw new NotFoundException('Semester not found');
            return semester;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve semester');
        }
    }

    public async findOneByPeriodandYear (period: string, year: string): Promise<SemesterEntity | null> {
        try {
            const semester = await this.semesterRepository.findOne({ where: { period, year } });
            if (!semester) return null;
            return semester;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve semester');
        }
    }
    public async update(id: string, createSemesterDto: CreateSemesterDto): Promise<SemesterEntity> {
        try {
            await this.semesterRepository.update(id, createSemesterDto);
            return this.findOne(id);
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to update semester');
        }
    }

    public async remove(id: string): Promise<ResponseMessage> {
        try {
            const result = await this.semesterRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException('Semester not found');
            }
            return { statusCode: 200, message: 'Semester deleted' };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to delete semester');
        }
    }

    public async getSemesterWithIndicatorSum(filterDto: FilterIndicatorSemesterDto): Promise<any> {
        const { localidadName, facultyName, careerName, modeName, indicatorAttributes } = filterDto;

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

        const query = this.semesterRepository
            .createQueryBuilder('semester')
            .leftJoin('semester.indicators', 'indicator')
            .leftJoin('indicator.locality', 'locality')  
            .leftJoin('indicator.career', 'career')      
            .leftJoin('career.faculty', 'faculty')       
            .leftJoin('indicator.mode', 'mode')          
            .select('semester.period', 'semesterPeriod')
            .addSelect('semester.year', 'semesterYear');
        
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

        query.groupBy('semester.period, semester.year');
        
        if (localidadName) {
            query.andWhere('locality.name = :localidadName', { localidadName });
        }
        
        if (facultyName) {
            query.andWhere('faculty.name = :facultyName', { facultyName });
        }
        
        if (careerName) {
            query.andWhere('career.name = :careerName', { careerName });
        }

        if (modeName) {
            query.andWhere('mode.name = :modeName', { modeName });
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
                    label: result.semesterYear, 
                    values: values            
                };
            });
        } catch (error) {
            this.logger.error('Failed to get semesters with indicator sum', error.stack);
            throw new Error('Failed to get semesters with indicator sum');
        }
    }
}
