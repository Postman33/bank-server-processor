import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from "@nestjs/common";
import { Office } from "../../entitiers/offices";

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository(Office) private readonly officeRepo: Repository<Office>
  ) {}

  async addOfficesFromFile() {
    //const filePath = path.join(__dirname, 'C:\\Users\\Lucky\\WebstormProjects\\bank-server-processor\\src\\offices.json', 'offices.json');
    const filePath='C:\\Users\\Lucky\\WebstormProjects\\bank-server-processor\\src\\offices.json'
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const offices = JSON.parse(fileContent);

    for (const office of offices) {
      const newOffice = this.officeRepo.create({
        salePointName: office.salePointName,
        address: office.address,
        status: office.status,
        rko: office.rko,
        officeType: office.officeType,
        salePointFormat: office.salePointFormat,
        suoAvailability: office.suoAvailability === 'Y',
        hasRamp: office.hasRamp === 'Y',
        location: {
          type: 'Point',
          coordinates: [office.longitude, office.latitude]
        },
        metroStation: office.metroStation,
        distance: office.distance,
        kep: office.kep,
        myBranch: office.myBranch
      });

      await this.officeRepo.save(newOffice);
    }
  }
}