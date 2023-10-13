import { Body, Controller, Post } from "@nestjs/common";
import { BranchService } from "../services/branch/branch.service";
import { Branch } from "../entitiers/branch.entity";
import {GraphManager} from "../graph/graph_manager";
import {Graph, GraphEdge, GraphNode} from "../graph/systems";

@Controller('banks')
export class BanksController {
  constructor(private branchService: BranchService) {
  }

  @Post('search')
  async searchBranches(@Body('services') services: string[]) {
    try {
      const branches: Branch[] =
        await this.branchService.findBranchesByServices(services);
      console.log(branches);
    } catch (error) {
      throw new Error('Unable to fetch branches.');
    }
  }

  @Post('search_radius')
  async searchBranchesRadius(@Body('lat') lat: number, @Body('lng') lng: number, @Body('radius') radius: number) {
    try {
      return await this.branchService.findBranchesInRadius(
        lat,
        lng,
        radius*1000,
      );
    } catch (error) {
      throw new Error('Unable to fetch branches.');
    }
  }

  @Post('find_optima_bank')
  async searchOptimaBank(@Body('lat_me') lat: number, @Body('lng_me') lng: number, @Body('radius') radius: number) {
    console.log("start search optima")
    try {
      return await this.branchService.findOptimalBank(
        lat,
        lng,
        radius*1000,
      );
    } catch (error) {
      throw new Error('Unable to fetch branches.');
    }
  }

  @Post('shortest_path')
  async calculate_shortest_path(@Body('lat_me') lat: number, @Body('lng_me') lng: number) {
    const graph = new Graph();
    const graphManager = new GraphManager(graph);

    // Добавляем узлы
    const node1 = new GraphNode(1, 10, 20);
    const node2 = new GraphNode(2, 20, 30);
    const node3 = new GraphNode(3, 30, 40);

    graphManager.addNode(node1);
    graphManager.addNode(node2);
    graphManager.addNode(node3);

    const edge1 = new GraphEdge(node1, node2, 5);
    const edge2 = new GraphEdge(node2, node3, 7);

    graphManager.addEdge(edge1);
    graphManager.addEdge(edge2);

    console.log(graphManager.calculate_shortest_path(lat, lng));

    return await graphManager.calculate_shortest_path(lat, lng);
  }

  // Метод контроллера принимает входные аргументы долтоты и шиироты
  // Мы ищем в этой точке с searchBranchesRadius с радиусом R точки
  // Из этих точек делаем bbox с помощью turf, делаем transformScale
  // Находим граф из этого нового bbox https://github.com/MatveiT/GraphFromOSM
  // Подсоединяем каждое отделение к ближайшему узлу, и присоединяем начальные координаты к ближайшему узлу。 Вес ребра - время обслуживния
  // shortestpath - алг дейкстры- ищем куда лучше
  // client: mapbox direction api - walk or automobile LineString

}
