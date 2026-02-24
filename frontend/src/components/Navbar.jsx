import { NavLink } from "react-router-dom";
import UserSelector from "./UserSelector";

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

          <NavLink to="/requests" className={linkClass}>
            My Requests
          </NavLink>
        </nav>
        <UserSelector />
      </div>
    </header>
  );
}
