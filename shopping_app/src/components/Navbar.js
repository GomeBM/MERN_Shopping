import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const handleLogout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userName");
  };

  return (
    <div className="navbar">
      <Link to="/">Shop</Link>
      {!cookies.access_token ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Link to="/cart">Cart</Link>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
};
