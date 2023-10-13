import {GraphNodeT} from "../graph/systems";

export class PriorityQueue {
    private nodes: { node: GraphNodeT, cost: number }[] = [];

    push(node: GraphNodeT, cost: number) {
        this.nodes.push({node, cost});
        this.nodes.sort((a, b) => a.cost - b.cost);
    }

    pop(): GraphNodeT | null {
        return this.nodes.shift()?.node || null;
    }

    isEmpty(): boolean {
        return !this.nodes.length;
    }
}