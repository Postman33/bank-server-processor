import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import * as fs from 'fs';
import {Injectable} from "@nestjs/common";
import {Office} from "../../entitiers/offices";
import { dijkstra } from "../../graph/algorithm/dijkstra";
import {GraphNodeT, GraphPathT} from "../../graph/systems";
import { Feature } from "typeorm/driver/types/GeoJsonTypes";

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

  euclideanDistance(point1: [number, number], point2: [number, number]): number {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  calculateDistance([x1, y1]: number[], [x2, y2]: number[]): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  searchNearest(lat: number, lon: number, nodes: any[]): any {
    let nearestNode = null;
    let minDistance = Infinity;
    console.log('====');
    console.log(nodes);
    for (const node of nodes) {
      const nodeCoordinates = node.geometry.coordinates; // предполагается, что у узла есть поле geometry с координатами
      const distance = this.euclideanDistance(nodeCoordinates, [lon, lat]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestNode = node;
      }
    }

    return nearestNode;
  }

  findNearestNode(graph: any, coord: number[]): any {
    let nearestNode = null;
    let minDistance = Infinity;
    graph.nodes = graph.features.filter( node => node.type === 'Feature' && node.geometry.type === 'Point')
    for (const node of graph.nodes) {
      const { lon, lat } = node as { lon: number, lat: number };
      const distance = this.calculateDistance(coord, [lon, lat]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestNode = node;
      }
    }

    return nearestNode;
  }

  weightCalc(path: GraphPathT): number {
    let totalTime = 0; // общее время в секундах

    for (let i = 0; i < path.length - 1; ++i) {
      const node = path[i];
      if (node.distanceToNext && node.speed) {
        const timeToNextNode = node.distanceToNext / node.speed;
        totalTime += timeToNextNode;
      }
    }

    return totalTime;
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
    const lineString = turf.multiPoint(coords)

    const bbox = turf.bbox(lineString);
    const bboxPolygon =turf.transformScale(turf.bboxPolygon(bbox),1.2);
    console.log(bboxPolygon);

    const mySettings = {                                         // Define my settings
      bbox: bbox,                          // Geographical rectangle
      highways: ["primary", "secondary", "tertiary", "residential"],     // Type of roads to consider
      timeout: 600000000, maxContentLength: 1500000000                   // OSM query parameters
    }
    const osmData = await graphFromOsm.getOsmData(mySettings);   // Import OSM raw data

    console.log('OSM');
    console.log(osmData.features);
    const graph = graphFromOsm.osmDataToGraph(osmData)

    // TODO: функция определения ближайшего узла по координатам
    // function searchNearest(lat:number, lon: number) -> можно в самом конце соединить граф с начальной точкой
    // соединить location к ближайшему узлу

    const nearestNode = this.searchNearest(lat, lng, graph.features as Feature[]);
    //console.log(nearestNode);

    // соединить каждый офис с ближайшим узлом на грфафе
    const officeToNodeMap: { [officeId: string]: any } = {};

    for (const office of offices) {
      officeToNodeMap[office.id] = this.findNearestNode(graph, office.location.coordinates);
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
      const startNode = nearestNode;  // ваша текущая позиция
      const endNode = officeToNodeMap[officeId];  // узел ближайший к офису

      // TODO: Вычислите путь от startNode до endNode.
      // Я предполагаю, что у вас есть функция graph.shortpath(), которая делает это.
      const path = dijkstra(graph, startNode, endNode);

      const timeInPath = this.weightCalc(await path);
      pathsLength[officeId] = timeInPath;

      if (timeInPath < shortestTime) {
        shortestTime = timeInPath;
        optimalOfficeId = officeId;
        optimalPath = path;
      }
    }

    // Здесь optimalPath содержит наиболее короткий путь.
    console.log("Оптимальный путь ведет к офису с ID:", optimalOfficeId);

    fs.writeFileSync('graphdata.json',JSON.stringify(graph));


    return offices

    // const lineStringResult = turf.lineString(optimalPath);
    // return lineStringResult;
  }
}