import { NavLink, useLocation } from "react-router-dom";
import UserSelector from "./UserSelector";

// Check if the user is authenticated based on the presence of a token
const linkClass = ({ isActive }) => ["nav__link", isActive && "active"].filter(Boolean).join(" ");


export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem("token");
  // Get current route to toggle visibility of the Login link
  const location = useLocation();
  
  // Clear authentication data and redirect to login page
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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
            <NavLink to="/login" className={linkClass}>Login</NavLink>
          )}

          {/* Show private routes and sign-out option only to authenticated users */}
          {isLoggedIn && (
            <>
              <NavLink to="/requests" className={linkClass}>My Requests</NavLink>
              <button onClick={handleLogout} className={`${linkClass({ isActive: false })} nav__btn`}>
                Logout
              </button>
            </>
          )}
        </nav>
        {/* Once logged in User ID manual selection is disabled  */}
        {!isLoggedIn && <UserSelector />}
      </div>
    </header>
  );
}
