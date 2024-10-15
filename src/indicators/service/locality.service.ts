import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalityEntity } from '../entities/locality.entity';
import { CreateLocalityDto } from '../dto/create-locality.dto';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { handlerError } from 'src/common/utils/handler-error.utils';
import { FilterIndicatorLocalityDto } from '../dto/filter-indicator-locality.dto';

@Injectable()
export class LocalityService {
    private readonly logger = new Logger('LocalityService');

    constructor(
        @InjectRepository(LocalityEntity)
        private readonly localityRepository: Repository<LocalityEntity>,
    ) { }

    public async create(createLocalityDto: CreateLocalityDto): Promise<LocalityEntity> {
        try {
            const locality = this.localityRepository.create(createLocalityDto);
            return await this.localityRepository.save(locality);
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to create locality');
        }
    }

    public async findAll(): Promise<ResponseGet> {
        try {
            const [data, countData] = await this.localityRepository.findAndCount();
            return { data, countData };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve localities');
        }
    }

    public async findOne(id: string): Promise<LocalityEntity> {
        try {
            const locality = await this.localityRepository.findOne({ where: { id } });
            if (!locality) throw new NotFoundException('Locality not found');
            return locality;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve locality');
        }
    }

    public async findOneByName(name: string): Promise<LocalityEntity | null> {
        try {
            const locality = await this.localityRepository.findOne({ where: { name } });
            if (!locality) return null;
            return locality;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve locality');
        }
    }

    
    public async update(id: string, createLocalityDto: CreateLocalityDto): Promise<LocalityEntity> {
        try {
            await this.localityRepository.update(id, createLocalityDto);
            return this.findOne(id);
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to update locality');
        }
    }

    public async remove(id: string): Promise<ResponseMessage> {
        try {
            const result = await this.localityRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException('Locality not found');
            }
            return { statusCode: 200, message: 'Locality deleted' };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to delete locality');
        }
    }

    public async getLocalityWithIndicatorSum(filterDto: FilterIndicatorLocalityDto): Promise<any> {
        const { modeName, semesterPeriod, semesterYear, facultyName, indicatorAttributes } = filterDto;

        const query = this.localityRepository
            .createQueryBuilder('locality')
            .leftJoin('locality.indicators', 'indicator')
            .leftJoin('indicator.semester', 'semester')
            .leftJoin('indicator.career', 'career')  
            .leftJoin('indicator.mode', 'mode')
            .leftJoin('career.faculty', 'faculty')   
            .select('locality.name', 'localityName');

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

        query.groupBy('locality.name');

        if (modeName) {
            query.andWhere('mode.name = :modeName', { modeName });
        }
        if (semesterPeriod && semesterYear) {
            query.andWhere('semester.period = :semesterPeriod', { semesterPeriod });
            query.andWhere('semester.year = :semesterYear', { semesterYear });
        }
        if (facultyName) {
            query.andWhere('faculty.name = :facultyName', { facultyName }); 
        }

        try {
            return await query.getRawMany();
        } catch (error) {
            this.logger.error('Failed to get localities with indicator sum', error.stack);
            throw new Error('Failed to get localities with indicator sum');
        }
    }

}
