import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModeEntity } from '../entities/mode.entity';
import { CreateModeDto } from '../dto/create-mode.dto';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { handlerError } from 'src/common/utils/handler-error.utils'; 
import { FilterIndicatorModeDto } from '../dto/filter-indicator-mode.dto';

@Injectable()
export class ModeService {
    private readonly logger = new Logger('ModeService');

    constructor(
        @InjectRepository(ModeEntity)
        private readonly modeRepository: Repository<ModeEntity>,
    ) { }

    public async create(createModeDto: CreateModeDto): Promise<ModeEntity> {
        try {
            const mode = this.modeRepository.create(createModeDto);
            return await this.modeRepository.save(mode);
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to create mode');
        }
    }

    public async findAll(): Promise<ResponseGet> {
        try {
            const [data, countData] = await this.modeRepository.findAndCount();
            return { data, countData };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve modes');
        }
    }

    public async findOne(id: string): Promise<ModeEntity> {
        try {
            const mode = await this.modeRepository.findOne({ where: { id } });
            if (!mode) throw new NotFoundException('Mode not found');
            return mode;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve mode');
        }
    }

    public async findOneByName(name: string): Promise<ModeEntity | null> {
        try {
            const mode = await this.modeRepository.findOne({ where: { name } });
            if (!mode) return null;
            return mode;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve mode');
        }
    }

    public async update(id: string, createModeDto: CreateModeDto): Promise<ModeEntity> {
        try {
            await this.modeRepository.update(id, createModeDto);
            return this.findOne(id);
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to update mode');
        }
    }

    public async remove(id: string): Promise<ResponseMessage> {
        try {
            const result = await this.modeRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException('Mode not found');
            }
            return { statusCode: 200, message: 'Mode deleted' };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to delete mode');
        }
    }

    public async getModeWithIndicatorSum(filterDto: FilterIndicatorModeDto): Promise<any> {
        const { localidadName, facultyName, semesterPeriod, semesterYear, indicatorAttributes } = filterDto;

        const query = this.modeRepository
            .createQueryBuilder('mode')
            .leftJoin('mode.indicators', 'indicator')   
            .leftJoin('indicator.locality', 'locality') 
            .leftJoin('indicator.career', 'career')     
            .leftJoin('career.faculty', 'faculty')      
            .leftJoin('indicator.semester', 'semester') 
            .select('mode.name', 'modeName');

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

        query.groupBy('mode.name');
        
        if (localidadName) {
            query.andWhere('locality.name = :localidadName', { localidadName });
        }
        
        if (facultyName) {
            query.andWhere('faculty.name = :facultyName', { facultyName });
        }
        
        if (semesterPeriod && semesterYear) {
            query.andWhere('semester.period = :semesterPeriod', { semesterPeriod });
            query.andWhere('semester.year = :semesterYear', { semesterYear });
        }

        try {
            return await query.getRawMany();
        } catch (error) {
            this.logger.error('Failed to get modes with indicator sum', error.stack);
            throw new Error('Failed to get modes with indicator sum');
        }
    }

}
