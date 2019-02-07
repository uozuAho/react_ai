import * as React from 'react';
import * as SVG from 'svg.js';
import { PandemicBoard, City, Colour, all_colours } from 'src/games/pandemic/pandemic_board';
import { IterUtils } from 'src/libs/array/iter_utils';
import { PandemicGameState, CityState } from 'src/games/pandemic/game_state';

export class Pandemic extends React.Component {

    private _svg: SVG.Doc;
    private _game_state: PandemicGameState;

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
        return new SvgCity(this._svg, city);
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

    private _city_circle: SVG.Circle;
    private _name: SVG.Text;
    private _cubes: SvgCityCubesDisplay;

    constructor(svg: SVG.Doc, city_state: CityState) {

        const city = city_state.city;

        this._city_circle = svg.circle(20)
            .center(city.location.x, city.location.y)
            .fill(city.colour);

        this._name = svg.text(city.name)
            .center(city.location.x, city.location.y - 20);

        this._cubes = new SvgCityCubesDisplay(svg, city_state);
    }
}

class SvgCityCubesDisplay {
    constructor(private _svg: SVG.Doc, city_state: CityState) {

        const svgMap = new Map<Colour, SVG.Text>();

        let offset = 0;
        for (const colour of all_colours) {
            const svgText = this.createCubeSvgText(city_state, colour, offset);
            svgMap.set(colour, svgText);
            offset += 20;
        }
    }

    private createCubeSvgText(city: CityState, colour: Colour, x_offset: number) {

        const city_pos = city.city.location;
        const num_cubes = city.num_cubes(colour).toString();

        return this._svg.text(num_cubes)
            .center(city_pos.x + x_offset, city_pos.y + 20)
            .stroke(colour);
    }
}
