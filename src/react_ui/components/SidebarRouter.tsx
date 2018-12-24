import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Hello } from './Hello';

interface IRouteItem {
  path: string;
  render: () => JSX.Element;
  exact: boolean;
}

class RouteItem implements IRouteItem {
  constructor(
    public path: string,
    public render: () => JSX.Element,
    public exact = false
  ) {}
}

const routes: IRouteItem[] = [
  new RouteItem("/",
    () => <h2>No one's home</h2>,
    true
  ),
  new RouteItem(
    "/hello",
    () => <Hello />
  ),
  new RouteItem(
    "/shoelaces",
    () => <h2>Shoelacesoo</h2>
  )
];

const renderSidebar = () => (
  <div
    style={{
      padding: "10px",
      width: "40%",
    }}
  >
    <ul style={{ listStyleType: "none", padding: 0 }}>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/hello">Hello</Link>
      </li>
      <li>
        <Link to="/shoelaces">Shoelaces</Link>
      </li>
    </ul>
  </div>
)

const renderContent = () => (
  <div style={{ flex: 1, padding: "10px" }}>
    {routes.map((route, index) => (
      <Route
        key={index}
        path={route.path}
        exact={route.exact}
        component={route.render}
      />
    ))}
  </div>
)

export const SidebarRouter = () => (
  <Router>
      <div style={{ display: "flex" }}>
        {renderSidebar()}
        {renderContent()}
      </div>
  </Router>
);
