import * as React from 'react';
import { SidebarRouter, ISidebarItem, SidebarItem } from './SidebarRouter';
import { Hello } from './Hello';
import { AStar } from './alg_views/search/AStar';

export function App() {
    return (
        <div className="app">
            <SidebarRouter items={componentRoutes}/>
        </div>
    );
}

const componentRoutes: ISidebarItem[] = [
    new SidebarItem(
      "/",
      "Home",
      () => <h2>No one's home</h2>
    ).matchRouteExactly(),
    new SidebarItem(
        "/astar",
        "A* search",
        () => <AStar />
    ),
    new SidebarItem(
      "/hello",
      "Hello",
      () => <Hello />
    ),
    new SidebarItem(
      "/shoelaces",
      "Shoelaces",
      () => <h2>Shoelacesoo</h2>
    )
];
