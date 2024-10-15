import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { FacultyEntity } from "./faculty.entity";
import { IndicatorEntity } from "./indicator.entity";

@Entity({ name: 'career' })
export class CareerEntity extends BaseEntity {
    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    code: string;

    @ManyToOne(() => FacultyEntity, faculty => faculty.careers)
    faculty: FacultyEntity;

    @OneToMany(() => IndicatorEntity, indicator => indicator.career)    
    indicators: IndicatorEntity[];
}
