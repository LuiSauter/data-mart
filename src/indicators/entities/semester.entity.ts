import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { IndicatorEntity } from "./indicator.entity";

@Entity({name: 'semester'})
export class SemesterEntity extends BaseEntity{
    @Column({type: 'varchar', nullable: false})
    period: string;

    @Column({type: 'varchar', nullable: false})
    year: string;

    @OneToMany(() => IndicatorEntity, indicator => indicator.semester)
    indicators: IndicatorEntity[];
}