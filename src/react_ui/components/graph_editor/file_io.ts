import * as FileSaver from 'file-saver';
import { GraphT } from 'src/ai_lib/structures/graphT';
import { GraphEditorNode } from './GraphEditorNode';
import { Point2d } from 'src/ai_lib/structures/point2d';
import { Edge } from 'src/ai_lib/structures/igraph';

export function saveToFile(graph: GraphT<GraphEditorNode>) {
    const graphFile = GraphFile.fromGraph(graph);
    const blob = new Blob([JSON.stringify(graphFile, null, 2)], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, 'graph.json');
}

class GraphFile {

    public nodes: Point2d[];
    public edges: Edge[];

    public static fromGraph(graph: GraphT<GraphEditorNode>): GraphFile {
        const file = new GraphFile();
        file.nodes = graph.get_nodes().map(n => new Point2d(n.x(), n.y()));
        file.edges = graph.get_edges();
        return file;
    }
}
