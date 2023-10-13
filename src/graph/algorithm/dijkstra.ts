import {Graph, GraphNode } from ".././systems";

export async function dijkstra(graph: Graph, start: GraphNode): Promise<Map<number, number>> {
    const distances: Map<number, number> = new Map();
    const visited: Set<number> = new Set();

    graph.nodes().forEach(node => distances.set(node.id, Infinity));
    distances.set(start.id, 0);

    while (visited.size < graph.countOfNodes()) {
        const currentNode = [...distances.entries()]
            .filter(([nodeId, _]) => !visited.has(nodeId))
            .sort((a, b) => a[1] - b[1])[0][0];

        visited.add(currentNode);

        const neighbors = graph.getNeighbors(new GraphNode(currentNode, 0, 0));

        for (const neighbor of neighbors) {
            const newDist = distances.get(currentNode) + neighbor.weight;
            if (newDist < distances.get(neighbor.to.id)) {
                distances.set(neighbor.to.id, newDist);
            }
        }
    }

    return distances;
}