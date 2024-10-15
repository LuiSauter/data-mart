import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalityEntity } from '../entities/locality.entity';
import { CreateLocalityDto } from '../dto/create-locality.dto';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { handlerError } from 'src/common/utils/handler-error.utils';

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
}
