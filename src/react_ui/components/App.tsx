import * as React from 'react';
import { SidebarRouter, ISidebarItem, SidebarItem } from './SidebarRouter';
import { Hello } from './Hello';
import { AStar } from './alg_views/search/AStar';
import { GraphEditor } from './graph_editor/GraphEditor';
import { NodeOrdererView } from './alg_views/node_orderer/NodeOrdererView';
import { GraphColoringView } from './alg_views/graph_coloring/GraphColoringView';
import { Pandemic } from '../games/Pandemic';

export function App() {
    return (
        <div className="app">
            <SidebarRouter items={componentRoutes}/>
        </div>
    );
}

const componentRoutes: ISidebarItem[] = [
    new SidebarItem(
        "/astar",
        "A* search",
        () => <AStar />
    ),
    new SidebarItem(
        "/graph_editor",
        "Graph editor",
        () => <GraphEditor />
    ),
    new SidebarItem(
        "/node_order",
        "Node orderer",
        () => <NodeOrdererView />
    ),
    new SidebarItem(
        "/graph_coloring",
        "Graph coloring",
        () => <GraphColoringView />
    ),
    new SidebarItem(
        "/pandemic",
        "Pandemic",
        () => <Pandemic />
    ),
    new SidebarItem(
      "/hello",
      "Hello",
      () => <Hello />
    ),
];
