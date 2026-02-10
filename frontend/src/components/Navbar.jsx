import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) => ["navLink", isActive && "isActive"].filter(Boolean).join(" ");

export default function Navbar() {
  return (
    <header className="nav">
      <div className="navInner">
        <NavLink to="/" className="brand">
          Community Tool Library
        </NavLink>

        <nav className="links">
          <h2 className="sr-only">Main</h2>

          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/tools" className={linkClass}>
            Tools
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
