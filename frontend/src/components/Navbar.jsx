import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) => ["nav__link", isActive && "active"].filter(Boolean).join(" ");

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand">
          Community Tool Library
        </NavLink>

        <nav className="nav__links" aria-label="Main">
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
