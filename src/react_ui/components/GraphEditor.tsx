import * as React from 'react';
import './GraphEditor.css';
import * as SVG from 'svg.js';

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
      const p = this._svg.point(e.x, e.y);
      this._svg.circle(20).move(p.x, p.y);
    });
  }
}
