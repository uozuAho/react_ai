import * as React from 'react';
import { Graph2dSearchVisualiser } from './graph_2d_search_vis';
import { ISearchProblem } from 'src/ai_lib/algorithms/search/search_problem';
import { Point2d } from 'src/ai_lib/structures/point2d';
import { AStarSearch } from 'src/ai_lib/algorithms/search/astar_search';

export class AStar extends React.Component {

    private searchVis: Graph2dSearchVisualiser;

    public componentDidMount() {
        this.searchVis = new Graph2dSearchVisualiser("astar_canvas", 500, 500, createSolver);
        this.searchVis.go();
    }

    public render() {
        return (
            <div>
                <h1>A* search</h1>
                <div id="div_buttons">
                    <button onClick={this.go}>go</button>
                    <button onClick={this.stop}>stop</button>
                    <button onClick={this.step}>step</button>
                    <button onClick={this.reset}>reset</button>
                </div>
                <canvas id="astar_canvas" height="500" width="500"/>
            </div>
        );
    }

    private go = () =>    { this.searchVis.go(); }
    private stop = () =>  { this.searchVis.stop(); }
    private step = () =>  { this.searchVis.step(); }
    private reset = () => { this.searchVis.reset(); }
}

function createSolver(problem: ISearchProblem<Point2d, Point2d>, goal: Point2d) {
    const heuristic = (node: Point2d) => Point2d.distanceSquared(node, goal);
    return new AStarSearch<Point2d, Point2d>(problem, Number.MAX_VALUE, heuristic);
}
