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

        const query = this.semesterRepository
            .createQueryBuilder('semester')
            .leftJoin('semester.indicators', 'indicator') // Join con indicadores
            .leftJoin('indicator.locality', 'locality')   // Join con localidad
            .leftJoin('indicator.career', 'career')       // Join con carrera
            .leftJoin('career.faculty', 'faculty')        // Join con facultad
            .leftJoin('indicator.mode', 'mode')           // Join con modalidad
            .select('semester.period', 'semesterPeriod')
            .addSelect('semester.year', 'semesterYear');

        // Seleccionar dinámicamente los indicadores
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

        // Filtrar por localidad
        if (localidadName) {
            query.andWhere('locality.name = :localidadName', { localidadName });
        }

        // Filtrar por facultad
        if (facultyName) {
            query.andWhere('faculty.name = :facultyName', { facultyName });
        }

        // Filtrar por carrera
        if (careerName) {
            query.andWhere('career.name = :careerName', { careerName });
        }

        // Filtrar por modalidad
        if (modeName) {
            query.andWhere('mode.name = :modeName', { modeName });
        }

        try {
            return await query.getRawMany();
        } catch (error) {
            this.logger.error('Failed to get semesters with indicator sum', error.stack);
            throw new Error('Failed to get semesters with indicator sum');
        }
    }
}
