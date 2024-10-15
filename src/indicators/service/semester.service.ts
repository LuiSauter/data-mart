import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemesterEntity } from '../entities/semester.entity';
import { CreateSemesterDto } from '../dto/create-semester.dto';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { handlerError } from 'src/common/utils/handler-error.utils';

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
}
