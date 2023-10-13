export class GraphNode {
    constructor(public id: number, public lat: number, public lng: number) {}
}

export class GraphEdge {
    constructor(public from: GraphNode, public to: GraphNode, public weight: number) {}
}

export class Graph {
    private mNodes: GraphNode[] = [];
    private mEdges: GraphEdge[] = [];

    addNode(node: GraphNode) {
        this.mNodes.push(node);
    }

    addEdge(edge: GraphEdge) {
        this.mEdges.push(edge);
    }

    getNeighbors(node: GraphNode): GraphEdge[] {
        return this.mEdges.filter(e => e.from.id === node.id);
    }

    public countOfNodes(): number {
        return this.mNodes.length;
    }

    public countOfEdges(): number {
        return this.mEdges.length;
    }

    public nodes(): GraphNode[] {
        return this.mNodes;
    }

    public edges(): GraphEdge[] {
        return this.mEdges;
    }
}