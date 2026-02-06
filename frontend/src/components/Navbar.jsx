import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand">
          Community Tool Library
        </NavLink>

        <nav className="nav__links" aria-label="Primary navigation">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}
          >
            Home
          </NavLink>

          <NavLink
            to="/tools"
            className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}
          >
            Tools
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
