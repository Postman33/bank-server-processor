import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from "@nestjs/common";
import { Office } from "../../entitiers/offices";
import { Atm } from "../../entitiers/atms";
const turf = require('@turf/turf');
const graphFromOsm = require('graph-from-osm'); // Import module


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
        loadFactor: Math.random()*100 % 101,
        myBranch: office.myBranch
      });

      await this.officeRepo.save (newOffice);
    }
  }

  async findOptimalOffice(lng: number, lat: number, radius: number): Promise<Office[]>{
    const offices: Office[] = await this.officeRepo
      .createQueryBuilder('office')
      .select([
        'office.id',
        'office.address',
        'office.location',
        'office.loadFactor',
      ])
      .where(
        `ST_DWithin(
          office.location, 
          ST_MakePoint(:lng, :lat)::geography, 
          :radius
        )`,
        { lat, lng, radius },
      )
      .getMany();


    const coords = []
    for (const office of offices){
        coords.push(office.location.coordinates)
    }
    const lineString = turf.lineString(coords)

    const bbox = turf.bbox(lineString);
    const bboxPolygon =turf.transformScale(turf.bboxPolygon(bbox),1.2);
    console.log(bboxPolygon);



    const mySettings = {                                         // Define my settings
      bbox: bbox,                          // Geographical rectangle
      highways: ["primary", "secondary", "tertiary", "residential"],     // Type of roads to consider
      timeout: 600000000, maxContentLength: 1500000000                   // OSM query parameters
    }
    const osmData = await graphFromOsm.getOsmData(mySettings);   // Import OSM raw data

    console.log(osmData);
    const graph = graphFromOsm.osmDataToGraph(osmData)
    console.log("Your graph contains " + graph.features.length + " nodes ans links.");


   fs.writeFileSync('graphdata.json',JSON.stringify(graph));


    return offices

  }


}