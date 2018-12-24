import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

interface IRouteItem {
  path: string;
  mini: () => JSX.Element;
  main: () => JSX.Element;
  exact: boolean;
}

class RouteItem implements IRouteItem {
  constructor(
    public path: string,
    public mini: () => JSX.Element,
    public main: () => JSX.Element,
    public exact = false
  ) {}
}

const routes: IRouteItem[] = [
  new RouteItem("/",
    () => <div>home!</div>,
    () => <h2>Homeoo</h2>,
    true
  ),
  new RouteItem(
    "/bubblegum",
    () => <div>bubblegum!</div>,
    () => <h2>Bubblegumoo</h2>
  ),
  new RouteItem(
    "/shoelaces",
    () => <div>shoelaces!</div>,
    () => <h2>Shoelacesoo</h2>
  )
];

export const AppRouter = () => (
  <Router>
      <div style={{ display: "flex" }}>
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
              <Link to="/bubblegum">Bubblegum</Link>
            </li>
            <li>
              <Link to="/shoelaces">Shoelaces</Link>
            </li>
          </ul>

          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.mini}
            />
          ))}
        </div>

        <div style={{ flex: 1, padding: "10px" }}>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </div>
      </div>
    </Router>
);
