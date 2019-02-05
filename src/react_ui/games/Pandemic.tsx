import * as React from 'react';
import * as SVG from 'svg.js';
import { PandemicBoard, City } from 'src/games/pandemic/pandemic_board';
import { IterUtils } from 'src/libs/array/iter_utils';

export class Pandemic extends React.Component {

    private _svg: SVG.Doc;
    private _board: PandemicBoard;
    private _city_factory: SvgCityFactory;

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
        this._svg = this.init_svg('pandemic_div');
        this._city_factory = new SvgCityFactory(this._svg);
        this.drawBoard();
    }

    private init_svg(element_id: string): SVG.Doc {
        const svg = SVG(element_id).size('100%', 500);
        this.fit_board_to_svg(svg);
        return svg;
    }

    private fit_board_to_svg(svg: SVG.Doc) {
        const margin = 40;

        const xcoords = this._board.getCities().map(c => c.location.x);
        const ycoords = this._board.getCities().map(c => c.location.y);
        const xmin = IterUtils.min(xcoords) - margin;
        const xmax = IterUtils.max(xcoords) + margin;
        const ymin = IterUtils.min(ycoords) - margin;
        const ymax = IterUtils.max(ycoords) + margin;
        const width = xmax - xmin;
        const height = ymax - ymin;

        svg.viewbox(xmin, ymin, width, height);
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
        return this._city_factory.newSvgCity(city);
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

class SvgCityFactory {
    public constructor(private _svg: SVG.Doc) {}

    public newSvgCity(city: City): SvgCity {

        const circle = this._svg.circle(20)
            .center(city.location.x, city.location.y)
            .fill(city.colour);

        const name = this._svg.text(city.name)
            .center(city.location.x, city.location.y - 20);

        return new SvgCity(city, circle, name);
    }
}

class SvgCity {

    public name: string;

    constructor(
        private city: City,
        private svg_circle: SVG.Circle,
        private svg_name: SVG.Text)
    {
        this.name = city.name;
    }
}
