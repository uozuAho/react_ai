import * as React from 'react';
import './GraphEditor.css';
import * as SVG from 'svg.js';

interface IGraphEditorState {
  isEdgeMode: boolean;
  draggingNode: DraggingNode | null;
  drawingEdge: DrawingEdge | null;
  edges: Edge[]
}

export class GraphEditor extends React.Component<{}, IGraphEditorState> {

  private _svg: SVG.Doc;

  constructor(props: any) {
    super(props);
    this.state = {
      isEdgeMode: false,
      draggingNode: null,
      drawingEdge: null,
      edges: []
    };
  }

  public render() {
    return (
      <div>
        <h1>Graph editor</h1>
        <button onClick={this.toggleEdgeMode}>
          {this.state.isEdgeMode ? 'place nodes' : 'place edges'}
        </button>
        <div id="graph_editor" />
      </div>
    );
  }

  public componentDidMount() {
    this._svg = SVG('graph_editor').size('100%', 500);
    this.setSvgMouseHandlers(this._svg);
  }

  private toggleEdgeMode = () => {
    this.setState({isEdgeMode: !this.state.isEdgeMode});
  }

  private setSvgMouseHandlers(svg: SVG.Doc) {
    svg.click((e: MouseEvent) => {
      if (!this.isDragging() && !this.state.isEdgeMode) {
        this.createNodeAtScreenCoords(e.x, e.y);
      }
    });
    svg.on('mouseup', () => {
      this._svg.off('mousemove');
      // cancel edge if it doesn't finish on a node
      if (this.state.drawingEdge) {
        this.state.drawingEdge.svgLine.remove();
        this.setState({drawingEdge: null});
      }
    });
  }

  private createNodeAtScreenCoords(x: number, y: number) {
    const p = this.screenToSvg(x, y);
    const node = this._svg.circle(20).move(p.x, p.y);
    this.addNodeModeMouseHandlers(node);
  }

  private startEdgeAtNode(node: SVG.Circle): DrawingEdge {
    const x = node.cx();
    const y = node.cy();
    const line = this._svg.line(x, y, x, y);
    return new DrawingEdge(line, node);
  }

  private addNodeModeMouseHandlers(node: SVG.Circle) {
    node.on('mousedown', () => {
      if (this.state.isEdgeMode) {
        const edge = this.startEdgeAtNode(node);
        this.setState({drawingEdge: edge});
        this._svg.on('mousemove', (moveEvent: MouseEvent) => {
          const p = this.screenToSvg(moveEvent.x, moveEvent.y);
          edge.setEndPos(p.x, p.y);
        });
      } else {
        const edgesStartingAtNode = this.state.edges.filter(e => e.fromNode === node);
        const edgesEndingAtNode = this.state.edges.filter(e => e.toNode === node);
        const draggingNode = new DraggingNode(node, edgesStartingAtNode, edgesEndingAtNode);
        this.setState({draggingNode});
        this.addNodeDraggingHandler(this._svg);
      }
    });
    node.on('mouseup', () => {
      this._svg.off('mousemove');
      if (this.state.drawingEdge) {
        const edge = this.state.drawingEdge;
        // fix end of edge to finish on node's center
        edge.setEndPos(node.cx(), node.cy());
        this.state.edges.push(Edge.fromDrawingEdge(edge, node));
        this.setState({drawingEdge: null});
      } else {
        this.setState({draggingNode: null});
      }
    });
  }

  private addNodeDraggingHandler(svg: SVG.Doc) {
    svg.on('mousemove', (e: MouseEvent) => {
      const p = this.screenToSvg(e.x, e.y);
      if (!this.state.isEdgeMode) {
        // modifying state... probably a no-no but meh
        this.state.draggingNode!.move(p.x, p.y);
      }
    });
  }

  /** convert screen coords to svg */
  private screenToSvg(x: number, y: number) {
    const p = this._svg.point(x, y);
    return {x: p.x, y: p.y};
  }

  private isDragging() {
    return this.state.draggingNode !== null;
  }
}

class DrawingEdge {
  constructor(
    public svgLine: SVG.Line,
    public fromNode: SVG.Circle)
  {
  }

  /* set end position in svg coords */
  public setEndPos(x: number, y: number) {
    const x1 = this.svgLine.attr('x1');
    const y1 = this.svgLine.attr('y1');
    this.svgLine.plot(x1, y1, x, y);
  }
}

class Edge {
  constructor(
    public svgLine: SVG.Line,
    public fromNode: SVG.Circle,
    public toNode: SVG.Circle)
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

  public static fromDrawingEdge(edge: DrawingEdge, toNode: SVG.Circle): Edge {
    return new Edge(edge.svgLine, edge.fromNode, toNode);
  }
}

class DraggingNode {
  constructor(
    public svgNode: SVG.Circle,
    public edgesFrom: Edge[],
    public edgesTo: Edge[]
  )
  {}

  /** Move the node to the given svg coords */
  public move(x: number, y: number) {
    // todo: move the svg circle's center to the given coords (use attr?)
    this.svgNode.move(x, y);
    for (const e of this.edgesFrom) {
      e.setStartPos(this.svgNode.cx(), this.svgNode.cy());
    }
    for (const e of this.edgesTo) {
      e.setEndPos(this.svgNode.cx(), this.svgNode.cy());
    }
  }
}
