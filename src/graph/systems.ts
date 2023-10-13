export type GraphNodeT = {
    id: string;
    coordinates: [number, number];
    distanceToNext?: number;
    speed?: number;
};

export type GraphPathT = GraphNodeT[];

export function getNeighbors(node: GraphNodeT, graph: any): GraphNodeT[] {
    return graph[node.id] || [];
}

export function getEdgeWeight(nodeA: GraphNodeT, nodeB: GraphNodeT): number {
    return nodeA.distanceToNext! / nodeA.speed!;
}