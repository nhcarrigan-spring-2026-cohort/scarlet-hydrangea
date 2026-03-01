import { NavLink, useLocation } from "react-router-dom";
import UserSelector from "./UserSelector";

const linkClass = ({ isActive }) =>
  ["nav__link", isActive && "active"].filter(Boolean).join(" ");

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem("token");
  const location = useLocation();

  function handleLogout() {
    // Simple + reliable: backend logout endpoint may not exist.
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }

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

          {/* Hide Login link if already on the login page or if authenticated */}
          {!isLoggedIn && location.pathname !== "/login" && (
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          )}

          {/* Show private routes and sign-out option only to authenticated users */}
          {isLoggedIn && (
            <>
              <NavLink to="/requests" className={linkClass}>
                My Requests
              </NavLink>

              <NavLink to="/admin/borrows" className={linkClass}>
                Admin
              </NavLink>

              <button
                onClick={handleLogout}
                className={`${linkClass({ isActive: false })} nav__btn`}
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Once logged in User ID manual selection is disabled */}
        {!isLoggedIn && <UserSelector />}
      </div>
    </header>
  );
}