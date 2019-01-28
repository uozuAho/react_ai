import * as FileSaver from 'file-saver';
import { GraphT } from 'src/ai_lib/structures/graphT';
import { GraphEditorNode } from './GraphEditorNode';
import { Point2d } from 'src/ai_lib/structures/point2d';
import { Edge } from 'src/ai_lib/structures/igraph';

export class GraphFile {

    public nodes: Point2d[];
    public edges: Edge[];

    public static fromGraph(graph: GraphT<GraphEditorNode>): GraphFile {
        const file = new GraphFile();
        file.nodes = graph.get_nodes().map(n => new Point2d(n.x(), n.y()));
        file.edges = graph.get_edges();
        return file;
    }

    public static fromJson(json: any): GraphFile {
        const file = new GraphFile();
        file.nodes = json.nodes.map((n: any) => new Point2d(n.x, n.y));
        file.edges = json.edges.map((e: any) => new Edge(e.from, e.to, e.weight));
        return file;
    }

    public to2dGraph(): GraphT<Point2d> {
        const graph = new GraphT<Point2d>();
        this.nodes.map(n => graph.add_node(n));
        this.edges.map(e => graph.add_edge(e.from, e.to, e.weight));
        return graph;
    }

    public saveToFile(path?: string) {
        const blob = new Blob([JSON.stringify(this, null, 2)], {type: 'text/plain;charset=utf-8'});
        FileSaver.saveAs(blob, path ? path : 'graph.json');
    }
}
