import * as React from 'react';
import './GraphEditor.css';
import * as SVG from 'svg.js';

const circle_selected_class = 'selected';

export class GraphEditor extends React.Component {

  private _svg: SVG.Doc;
  private _draggingNode: SVG.Circle | null = null;

  public render() {
    return (
      <div>
        <h1>Graph editor</h1>
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

  private createNodeAtScreenCoords(x: number, y: number) {
    const p = this.screenToSvg(x, y);
    const node = this._svg.circle(20).move(p.x, p.y);
    addNodeClickHandler(node);
    this.addNodeMouseDownHandler(node);
  }

  private addNodeMouseDownHandler(node: SVG.Circle) {
    node.on('mousedown', () => {
      this._draggingNode = node;
      // tslint:disable-next-line:no-console
      console.log('node mousedown');

      this._svg.on('mousemove', (e: MouseEvent) => {
        const p = this.screenToSvg(e.x, e.y);
        this._draggingNode!.move(p.x, p.y);
      });
    });
    node.on('mouseup', () => {
      this._draggingNode = null;
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
    return this._draggingNode !== null;
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
