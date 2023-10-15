// atm.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Atm } from "../entitiers/atms";
import * as fs from "fs";

@Injectable()
export class AtmService {
  constructor(
    @InjectRepository(Atm)
    private atmRepository: Repository<Atm>,
  ) {}

  // Загрузить в PostGIS данные.
  async addDataFromJson() {
    const jsonString = fs.readFileSync('C:\\Users\\Lucky\\WebstormProjects\\bank-server-processor\\src\\atms.json', 'utf-8');
    const dataAtms = JSON.parse(jsonString);
    for (const atmData of dataAtms.atms) {
      let atm = new Atm();
      atm.address = atmData.address;

      atm.location= {
        type: 'Point',
          coordinates: [atmData.longitude, atmData.latitude]
      }

      atm.allDay = atmData.allDay;
      atm.services = atmData.services || ""


      atm = await this.atmRepository.save(atm);

      console.log(atmData.services);
    }
  }

async findOptima(lng,lat,radius):Promise<Atm[]>{
  return await this.atmRepository
    .createQueryBuilder('atm')
    .select([
      'atm.id',
      'atm.address',
      'atm.location',
      'atm.services',
    ])
    .where(
      `ST_DWithin(
          atm.location, 
          ST_MakePoint(:lng, :lat)::geography, 
          :radius
        )`,
      { lat, lng, radius },
    )
    .getMany()
}

}