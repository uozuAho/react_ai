import * as React from 'react';
import * as SVG from 'svg.js';
import { PandemicBoard, City } from 'src/games/pandemic/pandemic_board';
import { IterUtils } from 'src/libs/array/iter_utils';
import { PandemicGameState, CityState } from 'src/games/pandemic/game_state';

export class Pandemic extends React.Component {

    private _svg: SVG.Doc;
    private _game_state: PandemicGameState;
    private _city_factory: SvgCityFactory;

    constructor(props: any) {
        super(props);
        this._game_state = PandemicGameState.createNew(new PandemicBoard());
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

        const xcoords = Array.from(IterUtils.map(this._game_state.get_cities(), c => c.city.location.x));
        const ycoords = Array.from(IterUtils.map(this._game_state.get_cities(), c => c.city.location.y));
        const xmin = IterUtils.min(xcoords) - margin;
        const xmax = IterUtils.max(xcoords) + margin;
        const ymin = IterUtils.min(ycoords) - margin;
        const ymax = IterUtils.max(ycoords) + margin;
        const width = xmax - xmin;
        const height = ymax - ymin;

        svg.viewbox(xmin, ymin, width, height);
    }

    private drawBoard() {
        const graph = this._game_state.get_city_graph();
        const cities = graph.get_nodes();

        for (const city of cities) {
            this.createCityAtSvgCoords(city);
        }
        for (const edge of graph.get_edges()) {
            this.createEdge(cities[edge.from].city, cities[edge.to].city);
        }
    }

    private createCityAtSvgCoords(city: CityState): SvgCity {
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

    public newSvgCity(city_state: CityState): SvgCity {

        const city = city_state.city;

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
