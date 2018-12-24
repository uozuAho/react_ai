import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export interface ISidebarItem {
  route: string;
  exact: boolean;
  label: string,
  render: () => JSX.Element;
}

export class SidebarItem implements ISidebarItem {

  public exact = false;

  constructor(
    public route: string,
    public label: string,
    public render: () => JSX.Element
  ) {}

  public matchRouteExactly(): SidebarItem {
    this.exact = true;
    return this;
  }
}

export interface ISidebarProps {
  items: ISidebarItem[];
}

export const SidebarRouter = (props: ISidebarProps) => (
  <Router>
      <div style={{ display: "flex" }}>
        {renderSidebar(props.items)}
        {renderContent(props.items)}
      </div>
  </Router>
);

const renderSidebar = (items: ISidebarItem[]) => {

  const sidebarLinks = items.map(item =>
    <li key={item.label}>
      <Link to={item.route}>{item.label}</Link>
    </li>
  );

  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      <ul>
        {sidebarLinks}
      </ul>
    </div>
  );
}

const renderContent = (items: ISidebarItem[]) => (
  <div style={{ flex: 1, padding: "10px" }}>
    {items.map((route, index) => (
      <Route
        key={index}
        path={route.route}
        exact={route.exact}
        component={route.render}
      />
    ))}
  </div>
)
