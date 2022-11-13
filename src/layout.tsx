import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <ul className="nav-menu">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/insert">Insert</Link>
          </li>
          <li>
            <Link to="/insert-files">Insert Files</Link>
          </li>
          <li>
            <Link to="/find">Find & Sort & Pagination</Link>
          </li>
          <li>
            <Link to="/join">Join</Link>
          </li>

          <li>
            <Link to="/delete">Delete</Link>
          </li>
          <li>
            <Link to="/update">Update</Link>
          </li>
          <li>
            <Link to="/flow">Flow</Link>
          </li>

          <li>
            <Link to="/log">Logging</Link>
          </li>
          <li>
            <Link to="/security">Security</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </header>
  );
};

export default Layout;
