import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Branch } from "../../entitiers/branch.entity";

const turf = require('@turf/turf');
const graphFromOsm = require('graph-from-osm'); // Import module

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  async findBranchesByServices(services: string[]): Promise<Branch[]> {
    return (
      this.branchRepository
        .createQueryBuilder('branch')
        //.where('branch.services @> :services', { services })
        .select([
          'branch.id',
          'branch.name',
          'branch.location',
          'branch.services',
          'branch.load',
        ])
        .getMany()
    );
  }

  async findBranchesInRadius(
    lat: number,
    lng: number,
    radius: number,
  ): Promise<Branch[]> {
    return this.branchRepository
      .createQueryBuilder('branch')
      .select([
        'branch.id',
        'branch.name',
        'branch.location',
        'branch.services',
        'branch.load',
      ])
      .where(
        `ST_DWithin(
          branch.location, 
          ST_MakePoint(:lng, :lat)::geography, 
          :radius
        )`,
        { lat, lng, radius },
      )
      .getMany();
  }

  async findOptimalBank(
    lat: number,
    lng: number,
    radius: number,
  ): Promise<Branch[]> {
    const tmp = await this.branchRepository
      .createQueryBuilder('branch')
      .select([
        'branch.id',
        'branch.name',
        'branch.location',
        'branch.services',
        'branch.load',
      ])
      .where(
        `ST_DWithin(
          branch.location,
          ST_MakePoint(:lng, :lat)::geography,
          :radius
        )`,
        { lat, lng, radius },
      )
      .getMany();

    console.log(JSON.stringify(tmp, null, 4));

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

    console.log(bbox_my);
    console.log(JSON.stringify(bboxPolygon, null, 4));


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
      console.log(osmData);
      const graph = graphFromOsm.osmDataToGraph(osmData); // Here is your graph
      console.log(
        'Your graph contains ' + graph.features.length + ' nodes ans links.',
      );
      return graph;
    };

    return generateGraph(mySettings);
  }
}
