import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from '../dto/create-faculty.dto';
import { FacultyEntity } from '../entities/faculty.entity';
import { ModeEntity } from '../entities/mode.entity';
import { ModeService } from './mode.service';
import { CreateModeDto } from '../dto/create-mode.dto';
import { SemesterEntity } from '../entities/semester.entity';
import { CreateSemesterDto } from '../dto/create-semester.dto';
import { SemesterService } from './semester.service';
import { CreateLocalityDto } from '../dto/create-locality.dto';
import { LocalityEntity } from '../entities/locality.entity';
import { LocalityService } from './locality.service';
import { CareerEntity } from '../entities/career.entity';
import { CreateCareerDto } from '../dto/create-career.dto';
import { CareerService } from './career.service';
import { CreateIndicatorDto } from '../dto/create-indicator.dto';
import { IndicatorService } from './indicator.service';
import { handlerError } from 'src/common/utils/handler-error.utils';

@Injectable()
export class ExcelService {
    private readonly logger = new Logger('ExcelService');

    constructor(
        private readonly facultyService: FacultyService,
        private readonly modeService: ModeService,
        private readonly semesterService: SemesterService,
        private readonly localityService: LocalityService,
        private readonly careerService: CareerService,
        private readonly indicatorService: IndicatorService,
    ) { }

    public async processExcel(file: Express.Multer.File) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        return data
    }

    public async saveData(file: Express.Multer.File) {
        try {
            //Obtener datos
            const data = await this.processExcel(file);
            //Recorrer cada dato
            for (const item of data) {
            //Si no existe la facultad se crea
            const faculty = item["FAC NOMBRE_FACULTAD"];
            let facultyFound: FacultyEntity = await this.facultyService.findOneByName(faculty);
            if (!facultyFound) {
                const createFacultyDto: CreateFacultyDto = {
                    name: faculty,
                };
                facultyFound = await this.facultyService.create(createFacultyDto);
            }
            //Si no existe la modalidad se crea
            const mode = item["MODALIDAD T"];
            let modeFound: ModeEntity = await this.modeService.findOneByName(mode);
            if (!modeFound) {
                const createModeDto: CreateModeDto = {
                    name: mode,
                };
                modeFound = await this.modeService.create(createModeDto);
            }
            //Si no existe el semestre se crea
            const semester = item["Periodo"];
            const [semesterYear, semesterPeriod] = semester.split('-'); 
            let semesterFound: SemesterEntity = await this.semesterService.findOneByPeriodandYear(semesterPeriod, semesterYear);
            if (!semesterFound) {
                const createSemesterDto: CreateSemesterDto = {
                    period: semesterPeriod, year: semesterYear
                };
                semesterFound = await this.semesterService.create(createSemesterDto);
            }
            //Si no existe la localidad se crea
            const localidad = item["LOCALIDAD"];
            let localidadFound: LocalityEntity = await this.localityService.findOneByName(localidad);
            if (!localidadFound) {
                const createLocalityDto: CreateLocalityDto = {
                    name: localidad,
                };
                localidadFound = await this.localityService.create(createLocalityDto);
            }
            //Si no existe la carrera se crea
            const carrera = item["CARRE NOMBRE_CARRERA"];
            let carreraFound: CareerEntity = await this.careerService.findOneByName(carrera);
            if (!carreraFound) {
                const createCareerDto: CreateCareerDto = {
                    name: carrera,
                    // code: carrera.split(' ')[0],
                    facultyId: facultyFound.id,
                };
                carreraFound = await this.careerService.create(createCareerDto);
            }
            //Crear el indicador
                const createIndicatorDto: CreateIndicatorDto = {
                    careerId: carreraFound.id,
                    localityId: localidadFound.id,
                    modeId: modeFound.id,
                    semesterId: semesterFound.id,
                    t_inscritos: item["_INS"],
                    t_nuevos: item["T_NUE"],
                    t_anteriores: item["T_ANT"],
                    matriculas_inscritas: item["MAT_INS"],
                    sin_nota: item["SIN_NOT"],
                    sin_nota_percent: parseFloat(item["%SNOT"]),
                    aprobados: item["APROBAD"],
                    aprobados_percent: parseFloat(item["%APRO"]),
                    reprobados: item["REPROBA"],
                    reprobados_percent: parseFloat(item["%REPR"]),
                    reprobados_con_0: item["R_CON_0"],
                    reprobados_con_0_percent: parseFloat(item["%REP0"]),
                    moras: item["MORAS"],
                    moras_percent: parseFloat(item["%MORA"]),
                    retirados: item["RETIR"],
                    ppa: item["PPA"] ? parseFloat(item["PPA"]) : null,
                    pps: item["PPS"] ? parseFloat(item["PPS"]) : null,
                    ppa1: item["PPA1"] ? parseFloat(item["PPA1"]) : null,
                    ppac: item["PPAC"] ? parseFloat(item["PPAC"]) : null,
                    egresados: item["EGRE"],
                    titulados: item["TIT"],
                };

                await this.indicatorService.create(createIndicatorDto);
           }

           return {message: 'Datos guardados exitosamente'};

        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Failed to save data');
        }
    }
}
