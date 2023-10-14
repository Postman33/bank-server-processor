import {getEdgeWeight, getNeighbors, GraphNodeT, GraphPathT} from "../systems";
import {PriorityQueue} from "../../container/priority_queue";

export async function dijkstra(graph: any, start: GraphNodeT, end: GraphNodeT): Promise<GraphPathT> {
    let distances: { [key: string]: number } = {};
    let previous: { [key: string]: GraphNodeT | null } = {};
    let queue = new PriorityQueue();

    distances[start.id] = 0;
    queue.push(start, 0);

    while (!queue.isEmpty()) {
        let currentNode = queue.pop();

        if (currentNode.id === end.id) {
            let path: GraphPathT = [];
            while (currentNode) {
                path.unshift(currentNode);
                currentNode = previous[currentNode.id] || null;
            }
            return path;
        }

        for (const neighbor of getNeighbors(currentNode!, graph)) {
            const alt = distances[currentNode!.id] + getEdgeWeight(currentNode!, neighbor);
            if (alt < (distances[neighbor.id] || Infinity)) {
                distances[neighbor.id] = alt;
                previous[neighbor.id] = currentNode;
                queue.push(neighbor, alt);
            }
        }
    }

    throw new Error("Путь не найден");
}