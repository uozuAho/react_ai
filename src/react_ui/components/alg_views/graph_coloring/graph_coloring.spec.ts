import { Graph } from '../../../../../src/ai_lib/structures/graph';
import { GraphColoring } from './graph_coloring';

describe('Graph coloring', () => {
    it('no edges should be valid', () => {
        const graph = new Graph(2);
        const isValid = GraphColoring.isValid(graph, [0, 0]);
        expect(isValid).toBe(true);
    });

    it('2 connected nodes with same color should be invalid', () => {
        const graph = new Graph(2);
        graph.add_edge(0, 1);
        const isValid = GraphColoring.isValid(graph, [0, 0]);
        expect(isValid).toBe(false);
    });

    it('2 nodes with no edges should have no invalid nodes', () => {
        const graph = new Graph(2);
        const numInvalid = GraphColoring.numInvalidNodes(graph, [0, 0]);
        expect(numInvalid).toBe(0);
    });

    it('2 connected nodes with same color should have 2 invalid nodes', () => {
        const graph = new Graph(2);
        graph.add_edge(0, 1);
        const numInvalid = GraphColoring.numInvalidNodes(graph, [0, 0]);
        expect(numInvalid).toBe(2);
    });
});
