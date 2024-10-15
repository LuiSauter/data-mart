import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { IndicatorEntity } from "./indicator.entity";

@Entity({name: 'locality'})
export class LocalityEntity extends BaseEntity {
    @Column({type: 'varchar', nullable: false})
    name: string;

    @OneToMany(() => IndicatorEntity, indicator => indicator.locality)
    indicators: IndicatorEntity[];
}