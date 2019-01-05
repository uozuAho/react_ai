import * as React from 'react';
import { SidebarRouter, ISidebarItem, SidebarItem } from './SidebarRouter';
import { Hello } from './Hello';
import { AStar } from './alg_views/search/AStar';
import { GraphEditor } from './graph_editor/GraphEditor';

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
      "/hello",
      "Hello",
      () => <Hello />
    ),
];
