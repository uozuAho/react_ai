import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Hello } from './Hello';

interface ISidebarItem {
  route: string;
  exact: boolean;
  sidebarText: string,
  render: () => JSX.Element;
}

class SidebarItem implements ISidebarItem {

  public exact = false;

  constructor(
    public route: string,
    public sidebarText: string,
    public render: () => JSX.Element
  ) {}

  public matchRouteExactly(): SidebarItem {
    this.exact = true;
    return this;
  }
}

const sidebarItems: ISidebarItem[] = [
  new SidebarItem(
    "/",
    "Home",
    () => <h2>No one's home</h2>
  ).matchRouteExactly(),
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

const renderSidebar = (items: ISidebarItem[]) => {

  const sidebarLinks = items.map(item =>
    <li key={item.sidebarText}>
      <Link to={item.route}>{item.sidebarText}</Link>
    </li>
  );

  return (
    <div
      style={{
        padding: "10px",
        width: "40%",
      }}
    >
      <ul>
        {sidebarLinks}
      </ul>
    </div>
  );
}

const renderContent = () => (
  <div style={{ flex: 1, padding: "10px" }}>
    {sidebarItems.map((route, index) => (
      <Route
        key={index}
        path={route.route}
        exact={route.exact}
        component={route.render}
      />
    ))}
  </div>
)

export const SidebarRouter = () => (
  <Router>
      <div style={{ display: "flex" }}>
        {renderSidebar(sidebarItems)}
        {renderContent()}
      </div>
  </Router>
);
