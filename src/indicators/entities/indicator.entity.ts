import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { CareerEntity } from "./career.entity";
import { LocalityEntity } from "./locality.entity";
import { ModeEntity } from "./mode.entity";
import { SemesterEntity } from "./semester.entity";

@Entity({ name: 'indicator' })
export class IndicatorEntity extends BaseEntity {
    @ManyToOne(() => CareerEntity, career => career.indicators)
    career: CareerEntity;

    @ManyToOne(() => LocalityEntity, locality => locality.indicators)
    locality: LocalityEntity;

    @ManyToOne(() => ModeEntity, mode => mode.indicators)
    mode: ModeEntity;

    @ManyToOne(() => SemesterEntity, semester => semester.indicators)
    semester: SemesterEntity;

    @Column({ type: 'int', nullable: false })
    t_inscritos: number;

    @Column({ type: 'int', nullable: false })
    t_nuevos: number;

    @Column({ type: 'int', nullable: false })
    t_anteriores: number;

    @Column({ type: 'int', nullable: false })
    matriculas_inscritas: number;

    @Column({ type: 'int', nullable: false })
    sin_nota: number;

    @Column({ type: 'decimal', nullable: false })
    sin_nota_percent: number;

    @Column({ type: 'int', nullable: false })
    aprobados: number;

    @Column({ type: 'decimal', nullable: false })
    aprobados_percent: number;

    @Column({ type: 'int', nullable: false })
    reprobados: number;

    @Column({ type: 'decimal', nullable: false })
    reprobados_percent: number;

    @Column({ type: 'int', nullable: false })
    reprobados_con_0: number;

    @Column({ type: 'decimal', nullable: false })
    reprobados_con_0_percent: number;

    @Column({ type: 'int', nullable: false })
    moras: number;

    @Column({ type: 'decimal', nullable: false })
    moras_percent: number;

    @Column({ type: 'int', nullable: false })
    retirados: number;

    @Column({ type: 'decimal', nullable: true })
    ppa: number;

    @Column({ type: 'decimal', nullable: true })
    pps: number;

    @Column({ type: 'decimal', nullable: true })
    ppa1: number;

    @Column({ type: 'decimal', nullable: true })
    ppac: number;

    @Column({ type: 'int', nullable: false })
    egresados: number;

    @Column({ type: 'int', nullable: false })
    titulados: number;
}
