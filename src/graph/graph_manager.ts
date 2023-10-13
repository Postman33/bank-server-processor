import { Body } from "@nestjs/common";
import {Graph, GraphEdge, GraphNode} from "./systems";
import { dijkstra } from "./algorithm/dijkstra";

export class GraphManager {
    private m_graph: Graph = new Graph();

    async calculate_shortest_path(@Body('lat_me') lat: number, @Body('lng_me') lng: number) {
        try {
            const startNode = this.m_graph.nodes().find(node => node.lat === lat && node.lng === lng);
            if (!startNode) {
                throw new Error('Start node not found');
            }

            const distances = await dijkstra(this.m_graph, startNode);
            return distances;

        } catch (error) {
            console.error("Error calculating shortest path:", error);
            throw error;
        }
    }

    public addNode(node: GraphNode) {
        this.m_graph.addNode(node);
    }

    public addEdge(edge: GraphEdge) {
        this.m_graph.addEdge(edge);
    }

    public countOfNodes(): number {
        return this.m_graph.countOfNodes();
    }

    public countOfEdges(): number {
        return this.m_graph.countOfNodes();
    }
}