import * as React from 'react';
import './GraphEditor.css';
import * as SVG from 'svg.js';
import { randomSquareGraph, DiGraphT, GraphT } from 'src/ai_lib/structures/graphT';
import { Point2d } from 'src/ai_lib/structures/point2d';
import { GraphEditorNode } from './GraphEditorNode';

interface IGraphEditorProps {
  /** Set a reference to this editor, for use by parent components */
  setRef?: (ref?: GraphEditor) => void;
}

interface IGraphEditorState {
  isEdgeMode: boolean;
  draggingNode: DraggingNode | null;
  drawingEdge: DrawingEdge | null;
  nodes: GraphEditorNode[];
  edges: Edge[]
}

export class GraphEditor extends React.Component<IGraphEditorProps, IGraphEditorState> {

  private _svg: SVG.Doc;
  private _arrowMarker: SVG.Marker;

  constructor(props: IGraphEditorProps) {
    super(props);
    this.state = {
      isEdgeMode: false,
      draggingNode: null,
      drawingEdge: null,
      nodes: [],
      edges: []
    };
  }

  public render() {
    return (
      <div>
        <button onClick={this.toggleEdgeMode}>
          {this.state.isEdgeMode ? 'Place nodes' : 'Place edges'}
        </button>
        <button onClick={this.clear}>Clear</button>
        <button onClick={this.generateRandomGraph}>Random</button>
        <div id="graph_editor" />
      </div>
    );
  }

  public componentDidMount() {
    if (this.props.setRef) {this.props.setRef(this)};
    this._svg = SVG('graph_editor').size('100%', 500);
    this.initArrowMarker();
    this.setSvgMouseHandlers(this._svg);
  }

  public componentWillUnmount() {
    if (this.props.setRef) {this.props.setRef(undefined)};
  }

  public setGraph(graph: GraphT<Point2d>) {
    this.clear();
    const nodes = graph.get_nodes().map(n => this.createNodeAtSvgCoords(n.x, n.y));
    const edges = graph.get_edges().map(e => this.createEdge(nodes[e.from], nodes[e.to]));
    this.setState({nodes, edges});
  }

  public getGraph(): GraphT<Point2d> {
    const graph = new GraphT<Point2d>();
    this.addNodesAndEdgesFromEditor(graph);
    return graph;
  }

  public getDigraph(): DiGraphT<Point2d> {
    const graph = new DiGraphT<Point2d>();
    this.addNodesAndEdgesFromEditor(graph);
    return graph;
  }

  private addNodesAndEdgesFromEditor(graph: GraphT<Point2d> | DiGraphT<Point2d>) {
    const nodeMap = new Map<GraphEditorNode, number>();

    this.state.nodes.map((node, idx) => {
      graph.add_node(new Point2d(node.x(), node.y()));
      nodeMap.set(node, idx);
    });

    this.state.edges.map(e =>
      graph.add_edge(nodeMap.get(e.fromNode)!, nodeMap.get(e.toNode)!)
    );
  }

  private toggleEdgeMode = () => {
    this.setState({isEdgeMode: !this.state.isEdgeMode});
  }

  private clear = () => {
    this.setState({
      nodes: [],
      edges: []
    });
    this._svg.clear();
    this.initArrowMarker();
  }

  private initArrowMarker() {
    this._arrowMarker = this._svg.marker(13, 13, add => {
      add.viewbox(-0, -5, 10, 10);
      add.ref(13, 0);
      add.path('M 0,-5 L 10 ,0 L 0,5').fill('#000');
    });
  }

  private setSvgMouseHandlers(svg: SVG.Doc) {
    svg.click((e: MouseEvent) => {
      if (!this.isDragging() && !this.state.isEdgeMode) {
        const node = this.createNodeAtScreenCoords(e.x, e.y);
        this.state.nodes.push(node);
      }
    });
    svg.on('mouseup', () => {
      this._svg.off('mousemove');
      this.cancelDrawingEdge();
    });
  }

  private cancelDrawingEdge() {
    if (this.state.drawingEdge) {
      this.state.drawingEdge.svgLine.remove();
      this.setState({drawingEdge: null});
    }
  }

  private createNodeAtScreenCoords(x: number, y: number): GraphEditorNode {
    const p = this.screenToSvg(x, y);
    return this.createNodeAtSvgCoords(p.x, p.y);
  }

  private createNodeAtSvgCoords(x: number, y: number): GraphEditorNode {
    const circle = this._svg.circle(20).center(x, y);
    const node = new GraphEditorNode(circle);
    this.addNodeModeMouseHandlers(node);
    return node;
  }

  private addNodeModeMouseHandlers(node: GraphEditorNode) {
    node.on('mousedown', () => {
      if (this.state.isEdgeMode) {
        this.startDrawingEdgeAtNode(node);
      } else {
        this.startDraggingNode(node);
      }
    });
    node.on('mouseup', (e: MouseEvent) => {
      e.stopPropagation();
      this._svg.off('mousemove');
      if (this.state.drawingEdge) {
        this.finishDrawingEdge(node);
      } else {
        this.finishDraggingNode();
      }
    });
    node.on('click', (e: MouseEvent) => {
      // stop clicks propagating to svg, which would draw a new node
      e.stopPropagation();
    });
  }

  private startDrawingEdgeAtNode(node: GraphEditorNode) {
    const x = node.x();
    const y = node.y();
    const line = this.createSvgEdge(x, y, x, y);

    const edge = new DrawingEdge(line, node);
    this.setState({drawingEdge: edge});

    this._svg.on('mousemove', (moveEvent: MouseEvent) => {
      const p = this.screenToSvg(moveEvent.x, moveEvent.y);
      edge.setEndPos(p.x, p.y);
    });
  }

  private startDraggingNode(node: GraphEditorNode) {
    const edgesStartingAtNode = this.state.edges.filter(e => e.fromNode === node);
    const edgesEndingAtNode = this.state.edges.filter(e => e.toNode === node);
    const draggingNode = new DraggingNode(node, edgesStartingAtNode, edgesEndingAtNode);
    this.setState({ draggingNode });

    this._svg.on('mousemove', (e: MouseEvent) => {
      const p = this.screenToSvg(e.x, e.y);
      if (!this.state.isEdgeMode) {
        // modifying state... probably a no-no but meh
        this.state.draggingNode!.move(p.x, p.y);
      }
    });
  }

  private finishDrawingEdge(node: GraphEditorNode) {
    const edge = this.state.drawingEdge!;
    // fix end of edge to finish on node's center
    edge.setEndPos(node.x(), node.y());
    this.state.edges.push(Edge.fromDrawingEdge(edge, node));
    this.setState({ drawingEdge: null });
  }

  private createEdge(from: GraphEditorNode, to: GraphEditorNode): Edge {
    const line = this.createSvgEdge(from.x(), from.y(), to.x(), to.y());
    return new Edge(line, from, to);
  }

  private createSvgEdge(x1: number, y1: number, x2: number, y2: number): SVG.Line {
    // send svg lines to the back since hovering over nodes takes precedence
    const line = this._svg.line(x1, y1, x2, y2).back();
    line.marker('end', this._arrowMarker);
    return line;
  }

  private finishDraggingNode() {
    this.setState({ draggingNode: null });
  }

  /** convert screen coords to svg */
  private screenToSvg(x: number, y: number) {
    const p = this._svg.point(x, y);
    return {x: p.x, y: p.y};
  }

  private isDragging() {
    return this.state.draggingNode !== null;
  }

  private generateRandomGraph = () => {
    const bounds = this._svg.viewbox();
    const graph = randomSquareGraph(bounds.height, bounds.width, 30);
    this.setGraph(graph);
  }
}

/** An edge while it is being drawn */
class DrawingEdge {
  constructor(
    public svgLine: SVG.Line,
    public fromNode: GraphEditorNode)
  {
  }

  /* set end position in svg coords */
  public setEndPos(x: number, y: number) {
    const x1 = this.svgLine.attr('x1');
    const y1 = this.svgLine.attr('y1');
    this.svgLine.plot(x1, y1, x, y);
  }
}

/** A completed edge */
class Edge {
  constructor(
    public svgLine: SVG.Line,
    public fromNode: GraphEditorNode,
    public toNode: GraphEditorNode)
  {
  }

  /* set start position in svg coords */
  public setStartPos(x: number, y: number) {
    const x2 = this.svgLine.attr('x2');
    const y2 = this.svgLine.attr('y2');
    this.svgLine.plot(x, y, x2, y2);
  }

  /* set end position in svg coords */
  public setEndPos(x: number, y: number) {
    const x1 = this.svgLine.attr('x1');
    const y1 = this.svgLine.attr('y1');
    this.svgLine.plot(x1, y1, x, y);
  }

  public static fromDrawingEdge(edge: DrawingEdge, toNode: GraphEditorNode): Edge {
    return new Edge(edge.svgLine, edge.fromNode, toNode);
  }
}

/** A node while it is being dragged */
class DraggingNode {
  constructor(
    public node: GraphEditorNode,
    public edgesFrom: Edge[],
    public edgesTo: Edge[]
  )
  {}

  /** Move the node to the given svg coords */
  public move(x: number, y: number) {
    this.node.setPos(x, y);
    for (const e of this.edgesFrom) {
      e.setStartPos(this.node.x(), this.node.y());
    }
    for (const e of this.edgesTo) {
      e.setEndPos(this.node.x(), this.node.y());
    }
  }
}
