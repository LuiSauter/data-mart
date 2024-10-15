import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { CareerEntity } from "./career.entity";

@Entity({name: 'faculty'})
export class FacultyEntity extends BaseEntity{
    @Column({type: 'varchar', nullable: false})
    name: string;

    @OneToMany(() => CareerEntity, career => career.faculty)
    careers: CareerEntity[];
}