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

        const query = this.facultyRepository
            .createQueryBuilder('faculty')
            .leftJoin('faculty.careers', 'career')
            .leftJoin('career.indicators', 'indicator')
            .leftJoin('indicator.semester', 'semester')            
            .leftJoin('indicator.locality', 'locality')
            .leftJoin('indicator.mode', 'mode')
            .select('faculty.name', 'facultyName');
        if (indicatorAttributes) {
            // Si indicatorAttributes es un string, convertirlo en array
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
            return await query.getRawMany();
        } catch (error) {
            this.logger.error('Failed to get faculties with indicator sum', error.stack);
            throw new Error('Failed to get faculties with indicator sum');
        }
    }
}
