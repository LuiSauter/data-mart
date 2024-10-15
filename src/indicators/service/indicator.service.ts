import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndicatorEntity } from '../entities/indicator.entity';
import { CreateIndicatorDto } from '../dto/create-indicator.dto';
import { CareerService } from '../service/career.service';
import { LocalityService } from '../service/locality.service';
import { ModeService } from '../service/mode.service';
import { SemesterService } from '../service/semester.service';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { handlerError } from 'src/common/utils/handler-error.utils';

@Injectable()
export class IndicatorService {
    private readonly logger = new Logger('IndicatorService');

    constructor(
        @InjectRepository(IndicatorEntity)
        private readonly indicatorRepository: Repository<IndicatorEntity>,
        private readonly careerService: CareerService,
        private readonly localityService: LocalityService,
        private readonly modeService: ModeService,
        private readonly semesterService: SemesterService,
    ) { }

    async create(createIndicatorDto: CreateIndicatorDto): Promise<IndicatorEntity> {
        try {
            const { careerId, localityId, modeId, semesterId, ...rest } = createIndicatorDto;

            const career = await this.careerService.findOne(careerId);
            const locality = await this.localityService.findOne(localityId);
            const mode = await this.modeService.findOne(modeId);
            const semester = await this.semesterService.findOne(semesterId);

            if (!career || !locality || !mode || !semester) {
                throw new NotFoundException('Some of the related entities were not found');
            }

            const indicator = this.indicatorRepository.create({
                ...rest,
                career,
                locality,
                mode,
                semester,
            });

            return await this.indicatorRepository.save(indicator);
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to create indicator');
        }
    }

    async findAll(): Promise<ResponseGet> {
        try {
            const [data, countData] = await this.indicatorRepository.findAndCount({
                relations: ['career', 'locality', 'mode', 'semester', 'career.faculty'],
            });
            return { data, countData };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve indicators');
        }
    }

    async findOne(id: string): Promise<IndicatorEntity> {
        try {
            const indicator = await this.indicatorRepository.findOne({
                where: { id },
                relations: ['career', 'locality', 'mode', 'semester'],
            });
            if (!indicator) throw new NotFoundException('Indicator not found');
            return indicator;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to retrieve indicator');
        }
    }

    async update(id: string, createIndicatorDto: CreateIndicatorDto): Promise<IndicatorEntity> {
        try {
            const indicator = await this.findOne(id);
            const { careerId, localityId, modeId, semesterId, ...rest } = createIndicatorDto;

            const career = await this.careerService.findOne(careerId);
            const locality = await this.localityService.findOne(localityId);
            const mode = await this.modeService.findOne(modeId);
            const semester = await this.semesterService.findOne(semesterId);

            if (!career || !locality || !mode || !semester) {
                throw new NotFoundException('Some of the related entities were not found');
            }

            await this.indicatorRepository.update(id, {
                ...rest,
                career,
                locality,
                mode,
                semester,
            });

            return this.findOne(id);
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to update indicator');
        }
    }

    async remove(id: string): Promise<ResponseMessage> {
        try {
            const result = await this.indicatorRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException('Indicator not found');
            }
            return { statusCode: 200, message: 'Indicator deleted' };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to delete indicator');
        }
    }
}
