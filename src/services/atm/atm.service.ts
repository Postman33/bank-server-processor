// atm.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Atm } from '../../entitiers/atms';
import { Service } from '../../entitiers/service';
import * as fs from 'fs';

@Injectable()
export class AtmService {
  constructor(
    @InjectRepository(Atm)
    private atmRepository: Repository<Atm>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async addDataFromJson() {
    const jsonString = fs.readFileSync('C:\\Users\\Lucky\\WebstormProjects\\bank-server-processor\\src\\atms.json', 'utf-8');
    const dataAtms = JSON.parse(jsonString);
    console.log(`data = `);
    console.log(dataAtms);
    for (const atmData of dataAtms.atms) {
      let atm = new Atm();
      atm.address = atmData.address;
      atm.latitude = atmData.latitude;
      atm.longitude = atmData.longitude;
      atm.allDay = atmData.allDay;

      atm = await this.atmRepository.save(atm);

      for (const serviceName in atmData.services) {
        const service = new Service();
        service.serviceName = serviceName;
        service.serviceCapability = atmData.services[serviceName].serviceCapability;
        service.serviceActivity = atmData.services[serviceName].serviceActivity;
        service.atm = atm;
        await this.serviceRepository.save(service);
      }
    }
  }
}