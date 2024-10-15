import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareerEntity } from '../entities/career.entity';
import { CreateCareerDto } from '../dto/create-career.dto';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { FacultyService } from './faculty.service';
import { handlerError } from 'src/common/utils/handler-error.utils';

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
}
