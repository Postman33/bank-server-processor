import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import * as fs from 'fs';
import {Injectable} from "@nestjs/common";
import {Office} from "../../entitiers/offices";
import { dijkstra } from "../../graph/algorithm/dijkstra";
import {GraphNodeT, GraphPathT} from "../../graph/systems";

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


  async searchInBox(lng: number, lat: number, radius: number): Promise<Office[]>{
    const tmp: Office[] = await this.officeRepo
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
      return tmp
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

    // TODO: функция определения ближайшего узла по координатам
    // function searchNearest(lat:number, lon: number) -> можно в самом конце соединить граф с начальной точкой
    // соединить location к ближайшему узлу
    osmData.features
    //const nearestNode = this.searchNearest(lat, lng, osmData.features);
   // console.log(nearestNode);

    // соединить каждый офис с ближайшим узлом на грфафе
    const officeToNodeMap: { [officeId: string]: any } = {};

    for (const office of offices) {
      //officeToNodeMap[office.id] = this.findNearestNode(graph, office.location.coordinates);
    }

    // let pathsLength = []
    // for (let office in offices){
    // path = graph.shortpath(location, office) -> int(время в пути)
    // pathsLength.push( weightCalc(path) )
    // }
    // min(pathsLength) -> самый быстрый маршрут (вернуть path)
    // вернуть в виде LineString
    // https://ru.wikipedia.org/wiki/GeoJSON

    const pathsLength: { [officeId: string]: number } = {};
    let shortestTime = Infinity;
    let optimalOfficeId: string | null = null;
    let optimalPath: any = null;

    for (const officeId in officeToNodeMap) {
      //const startNode = nearestNode;  // ваша текущая позиция
      const endNode = officeToNodeMap[officeId];  // узел ближайший к офису

      // TODO: Вычислите путь от startNode до endNode.
      // Я предполагаю, что у вас есть функция graph.shortpath(), которая делает это.
      //const path = dijkstra(graph, startNode, endNode);

      // const timeInPath = this.weightCalc(await path);
      // pathsLength[officeId] = timeInPath;
      //
      // if (timeInPath < shortestTime) {
      //   shortestTime = timeInPath;
      //   optimalOfficeId = officeId;
      //   optimalPath = path;
      // }
    }

    // Здесь optimalPath содержит наиболее короткий путь.
    console.log("Оптимальный путь ведет к офису с ID:", optimalOfficeId);

    fs.writeFileSync('graphdata.json',JSON.stringify(graph));


    return offices

    // const lineStringResult = turf.lineString(optimalPath);
    // return lineStringResult;
  }

   async findOptimalOffice2(lng: number, lat: number, radius: number): Promise<Office[]>{
    const tmp: Office[] = await this.officeRepo
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

    console.log("234432");

    const coordinatesArray: any[] = [];
    for (const item of tmp) {
      console.log(item);
      if (item.location.coordinates) {
        coordinatesArray.push(item.location.coordinates);
        console.log(item.location.coordinates);
      }
    }

    const line = turf.lineString(coordinatesArray);
    const bbox_my = turf.bbox(line);
    const bboxPolygon = turf.bboxPolygon(bbox_my);

//     console.log(bbox_my);
//     console.log(JSON.stringify(bboxPolygon, null, 4));

    const mySettings = {
      // Define my settings
      bbox: bbox_my, // Geographical rectangle
      highways: ['primary', 'secondary', 'tertiary', 'residential'], // Type of roads to consider
      timeout: 600000000,
      maxContentLength: 1500000000, // OSM query parameters
    };
    const generateGraph = async (settings) => {
      console.log('osmData');
      const osmData = await graphFromOsm.getOsmData(settings); // Import OSM raw data
      const graph = graphFromOsm.osmDataToGraph(osmData); // Here is your graph
      console.log(
        'Your graph contains ' + graph.features.length + ' nodes ans links.',
      );
      return graph;
    };

    const path = require('ngraph.path');

    let graph = generateGraph(mySettings);

    let pathFinder = path.aStar(graph); // graph is https://github.com/anvaka/ngraph.graph

    // now we can find a path between two nodes:
    let fromNodeId = 40;
    let toNodeId = 42;

    let foundPath = pathFinder.find(fromNodeId, toNodeId);

console.log(foundPath)

    return tmp;
  }

}