import * as React from 'react';
import './GraphEditor.css';
import * as SVG from 'svg.js';

const circle_selected_class = 'selected';

interface IGraphEditorState {
  isEdgeMode: boolean;
  draggingNode: SVG.Circle | null;
}

export class GraphEditor extends React.Component<{}, IGraphEditorState> {

  private _svg: SVG.Doc;

  constructor(props: any) {
    super(props);
    this.state = {
      isEdgeMode: false,
      draggingNode: null
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
    });
  }

  private createNodeAtScreenCoords(x: number, y: number) {
    const p = this.screenToSvg(x, y);
    const node = this._svg.circle(20).move(p.x, p.y);
    this.addNodeMouseHandlers(node);
  }

  private addNodeMouseHandlers(node: SVG.Circle) {
    node.on('mousedown', () => {
      if (!this.state.isEdgeMode) {
        this.setState({draggingNode: node});
        this.addNodeDraggingHandler(this._svg);
      }
    });
    node.on('mouseup', () => {
      this._svg.off('mousemove');
      if (!this.state.isEdgeMode) {
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
