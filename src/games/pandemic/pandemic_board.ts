import { PandemicMapData } from './board_data';
import { GraphT, EdgeT } from '../../../src/ai_lib/structures/graphT';
import { Point2d } from '../../../src/ai_lib/structures/point2d';

export type Colour = 'red' | 'blue' | 'black' | 'yellow';

export const all_colours: Colour[] = ['black', 'blue', 'red', 'yellow'];

/**
 * Reads and converts map.ts for easy usage.
 */
export class PandemicBoard {

  private readonly _cities: City[];
  private readonly _cityGraph: GraphT<City>;

  /** city name: city */
  private readonly _nameToCityLookup: Map<string, City>;
  /** city name: idx in graph nodes[] */
  private readonly _nameToIdxLookup: Map<string, number>;

  constructor() {
    this._cityGraph = new GraphT<City>();
    this._nameToCityLookup = new Map<string, City>();
    this._nameToIdxLookup = new Map<string, number>();
    // temp map of city ids to idx in node array. Ids are not used after construction
    const cityIdIdxMap = new Map<string, number>();
    let idx = 0;
    PandemicMapData.cities.forEach(city => {
      const cityObj = new City(city.name, new Point2d(city.x, city.y), city.colour as Colour);
      this._nameToCityLookup.set(city.name, cityObj);
      this._nameToIdxLookup.set(city.name, idx);
      this._cityGraph.add_node(cityObj);
      cityIdIdxMap.set(city.id, idx);
      idx++;
    });
    this._cities = this._cityGraph.get_nodes();
    PandemicMapData.edges.forEach(edge => {
      const cityIdxFrom = cityIdIdxMap.get(edge[0]);
      const cityIdxTo = cityIdIdxMap.get(edge[1]);
      this._cityGraph.add_edge(cityIdxFrom!, cityIdxTo!);
    });
    // invert city y coords for canvas drawing
    this.invertY();
  }

  public getCityGraph(): GraphT<City> {
    return this._cityGraph;
  }

  public getCities(): City[] {
    return this._cityGraph.get_nodes();
  }

  public getEdges(): Array<EdgeT<City>> {
    return this._cityGraph.get_edgesT();
  }

  public getCity(name: string): City {
    return this._nameToCityLookup.get(name)!;
  }

  public getAdjacentCities(city: City): City[] {
    const idx = this._nameToIdxLookup.get(city.name)!;
    return this._cityGraph.adjacent(idx)
      .map(adj => adj.other(idx))
      .map(i => this._cities[i]);
  }

  /** Invert city y coords (since +y is down on canvas).
   */
  private invertY() {
    // mirror around mid point: (x - mid) * -1 + mid
    //                        = 2mid - x
    const allPts = this._cities.map(c => c.location.y);
    const miny = Math.min(...allPts);
    const maxy = Math.max(...allPts);
    const mid2 = miny + maxy;
    this._cities.forEach(c => c.location.y = mid2 - c.location.y);
  }
}

export class City {
  constructor(
    public name: string,
    public location: Point2d,
    public colour: Colour,
  ) {
  }
}
