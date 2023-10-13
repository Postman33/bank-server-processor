import { GeoJSON, Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from "@nestjs/common";
import { Office } from "../../entitiers/offices";
import { Atm } from "../../entitiers/atms";
import { Feature } from "@turf/turf";
const turf = require('@turf/turf');
const graphFromOsm = require('graph-from-osm'); // Import module
const measure = require("../../distance");

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

  // let location = {lng, lat}
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
    for (const feature of graph.features){
      if (feature.geometry.type !== 'LineString') continue
      let coors = feature.geometry.coordinates
      //console.log(measure(coors[0][0],coors[0][1], coors[coors.length - 1][0],coors[coors.length - 1][1]));
      // 0[37.6120382,55.7588626],1[37.6121193,55.7587862],2[37.6124737,55.7584593]]
      // m(0,1) + m(1,2) = distance
      const distances=[]
      for (let i = 0; i < coors.length - 2; i++){
          distances.push(measure(coors[i][0],coors[i][1], coors[i+1][0],coors[i+1][1]))
      }
      let sum = 0
      for (const el of distances){
        sum+=Math.abs(el) // длина ребра
      }
      // TODO: Check measure
      console.log(sum);
      // create graph
      // graph.addLink('coors[0][0],coors[0][1]', 'coors[coors.length - 1][0],coors[coors.length - 1][1]', {weight: sum});
    }
    // TODO: функция определения ближайшего узла по координатам
    // function searchNearest(lat:number, lon: number) -> можно в самом конце соединить граф с начальной точкой
    // соединить location к ближайшему узлу


    // соединить каждый офис с ближайшим узлом на грфафе


    // let pathsLength = []
    // for (let office in offices){
    // path = graph.shortpath(location, office) -> int(время в пути)
    // pathsLength.push( weightCalc(path) )
    // }
    // min(pathsLength) -> самый быстрый маршрут (вернуть path)
    // вернуть в виде LineString
    // https://ru.wikipedia.org/wiki/GeoJSON

   fs.writeFileSync('graphdata.json',JSON.stringify(graph));


    return offices

  }


}