import * as React from 'react';
import './GraphEditor.css';
import * as SVG from 'svg.js';

const circle_selected_class = 'selected';

export class GraphEditor extends React.Component {

  private _svg: SVG.Doc;

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
      this.createNodeAtScreenCoords(e.x, e.y);
    });
  }

  private createNodeAtScreenCoords(x: number, y: number) {
    const p = this._svg.point(x, y);
    const circle = this._svg.circle(20).move(p.x, p.y);
    addNodeClickHandler(circle);
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
