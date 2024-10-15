import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { IndicatorEntity } from "./indicator.entity";

@Entity({ name: 'mode' })
export class ModeEntity extends BaseEntity {
    @Column({ type: 'varchar', nullable: false })
    name: string;

    @OneToMany(() => IndicatorEntity, indicator => indicator.mode)
    indicators: IndicatorEntity[];
}
