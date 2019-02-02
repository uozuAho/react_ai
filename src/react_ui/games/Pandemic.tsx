import * as React from 'react';
import * as SVG from 'svg.js';
import { PandemicBoard, City } from 'src/games/pandemic/pandemic_board';

export class Pandemic extends React.Component {

    private _svg: SVG.Doc;
    private _board: PandemicBoard;

    constructor(props: any) {
        super(props);
        this._board = new PandemicBoard();
    }

    public render() {
        return (
            <div>
                <h1>Pandemic!</h1>
                <div id="pandemic_div" />
            </div>
        )
    }

    public componentDidMount() {
        this._svg = SVG('pandemic_div').size('100%', 500);
        this.drawBoard();
    }

    private drawBoard() {
        const cityMap: Map<City, SvgCity> = new Map();
        for (const city of this._board.getCities()) {
            cityMap.set(city, this.createCityAtSvgCoords(city));
        }
        for (const edge of this._board.getEdges()) {
            this.createEdge(edge.from, edge.to);
        }
    }

    private createCityAtSvgCoords(city: City): SvgCity {
        const circle = this._svg.circle(20)
            .center(city.location.x, city.location.y)
            .fill(city.colour);
        return new SvgCity(city, circle);
    }

    private createEdge(from: City, to: City) {
        this.createSvgEdge(from.location.x, from.location.y,
            to.location.x, to.location.y);
    }

    private createSvgEdge(x1: number, y1: number, x2: number, y2: number): SVG.Line {
        // send svg lines to the back since hovering over nodes takes precedence
        return this._svg.line(x1, y1, x2, y2).back();
    }
}

class SvgCity {
    constructor(private city: City, private circle: SVG.Circle) {}
}
