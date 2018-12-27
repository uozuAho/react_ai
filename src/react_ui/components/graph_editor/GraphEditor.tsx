import * as React from 'react';
import './GraphEditor.css';
import * as SVG from 'svg.js';

const circle_selected_class = 'selected';

interface IGraphEditorState {
  isEdgeMode: boolean;
  draggingNode: SVG.Circle | null;
  drawingEdge: SVG.Line | null;
  edgeFromNode: SVG.Circle | null;
}

export class GraphEditor extends React.Component<{}, IGraphEditorState> {

  private _svg: SVG.Doc;

  constructor(props: any) {
    super(props);
    this.state = {
      isEdgeMode: false,
      draggingNode: null,
      drawingEdge: null,
      edgeFromNode: null
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
      // delete 'drawing' edge if it doesn't finish on a node
      if (this.state.drawingEdge) {
        this.state.drawingEdge.remove();
        this.setState({drawingEdge: null, edgeFromNode: null});
      }
    });
    svg.on('mousedown', (e: MouseEvent) => {
      if (this.state.isEdgeMode) {
        svg.on('mousemove', (moveEvent: MouseEvent) => {
          const edge = this.state.drawingEdge;
          if (edge === null) { return; }
          const p = this.screenToSvg(moveEvent.x, moveEvent.y);
          edge.plot(edge.attr('x1'), edge.attr('y1'), p.x, p.y);
        });
      }
    });
  }

  private createNodeAtScreenCoords(x: number, y: number) {
    const p = this.screenToSvg(x, y);
    const node = this._svg.circle(20).move(p.x, p.y);
    this.addNodeModeMouseHandlers(node);
  }

  private startEdgeAtSvgCoords(x: number, y: number) {
    const edge = this._svg.line(x, y, x, y);
    return edge;
  }

  private addNodeModeMouseHandlers(node: SVG.Circle) {
    node.on('mousedown', () => {
      if (this.state.isEdgeMode) {
        const edge = this.startEdgeAtSvgCoords(node.cx(), node.cy());
        this.setState({drawingEdge: edge, edgeFromNode: node});
      } else {
        this.setState({draggingNode: node});
        this.addNodeDraggingHandler(this._svg);
      }
    });
    node.on('mouseup', () => {
      this._svg.off('mousemove');
      if (this.state.drawingEdge) {
        const edge = this.state.drawingEdge;
        // fix end of edge to finish on node's center
        edge.plot(edge.attr('x1'), edge.attr('y1'), node.cx(), node.cy());
        this.setState({drawingEdge: null, edgeFromNode: null});
      } else {
        // todo: selecting node doesn't work
        if (!this.isDragging()) {
          this.toggleNodeIsSelected(node);
        }
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

  private toggleNodeIsSelected(node: SVG.Circle) {
    if (node.hasClass(circle_selected_class)) {
      node.removeClass(circle_selected_class)
    } else {
      node.addClass(circle_selected_class);
    }
  }
}
