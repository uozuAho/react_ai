import * as React from 'react';
import './GraphEditor.css';
import * as SVG from 'svg.js';

const circle_selected_class = 'selected';

interface IGraphEditorState {
  edgeMode: boolean;
  draggingNode: SVG.Circle | null;
}

export class GraphEditor extends React.Component<{}, IGraphEditorState> {

  private _svg: SVG.Doc;

  constructor(props: any) {
    super(props);
    this.state = {
      edgeMode: false,
      draggingNode: null
    };
  }

  public render() {
    return (
      <div>
        <h1>Graph editor</h1>
        <button onClick={this.toggleEdgeMode}>
          {this.state.edgeMode ? 'place nodes' : 'place edges'}
        </button>
        <div id="graph_editor" />
      </div>
    );
  }

  public componentDidMount() {
    this._svg = SVG('graph_editor').size('100%', 500);
    this._svg.click((e: MouseEvent) => {
      if (!this.isDragging()) {
        this.createNodeAtScreenCoords(e.x, e.y);
      }
    });
  }

  private toggleEdgeMode = () => {
    this.setState({edgeMode: !this.state.edgeMode});
  }

  private createNodeAtScreenCoords(x: number, y: number) {
    const p = this.screenToSvg(x, y);
    const node = this._svg.circle(20).move(p.x, p.y);
    addNodeClickHandler(node);
    this.addNodeMouseDownHandler(node);
  }

  private addNodeMouseDownHandler(node: SVG.Circle) {
    node.on('mousedown', () => {
      this.setState({draggingNode: node});
      // tslint:disable-next-line:no-console
      console.log('node mousedown');

      this._svg.on('mousemove', (e: MouseEvent) => {
        const p = this.screenToSvg(e.x, e.y);
        // modifying state... probably a no-no but meh
        this.state.draggingNode!.move(p.x, p.y);
      });
    });
    node.on('mouseup', () => {
      this.setState({draggingNode: null});
      this._svg.off('mousemove');
      // tslint:disable-next-line:no-console
      console.log('node mouseup');
    });
    this._svg.on('mouseup', () => {
      this._svg.off('mousemove');
      // tslint:disable-next-line:no-console
      console.log('svg mouseup');
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

function addNodeClickHandler(node: SVG.Circle) {
  node.click((e2: MouseEvent) => {
    e2.stopPropagation();
    if (node.hasClass(circle_selected_class)) {
      node.removeClass(circle_selected_class)
    } else {
      node.addClass(circle_selected_class);
    }
  });
}
