import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsShop } from "react-icons/bs";
import { IoLogOutOutline, IoStatsChart } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { ReactComponent as Logo } from "../assets/gambashop.svg";
import "./Navbar.css"; // Import the CSS file for styling

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null); // Ref for the menu

  const handleLogout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userName");
    navigate("/"); // Navigate to home page
    window.location.reload(); // Reload the page
  };

  // Handle click outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener when menu is open
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleMenuItemClick = () => {
    setIsMenuOpen(false); // Close the menu when a menu item is clicked
  };

  return (
    <div className="navbar">
      <Link to="/">
        <Logo width="100%" height="100%" />
      </Link>
      <Link to="/cart" onClick={handleMenuItemClick}>
        <FaShoppingCart className="dropdown-icon" />
      </Link>
      {!cookies.access_token ? (
        <>
          <Link to="/login" className="auth-text">
            Login
          </Link>
          <Link to="/register" className="auth-text">
            Register
          </Link>
        </>
      ) : (
        <>
          <div className="user-controls" ref={menuRef}>
            <button
              className="user-controls-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FaRegCircleUser className="dropdown-icon" />
            </button>
            <div className={`user-controls-menu ${isMenuOpen ? "show" : ""}`}>
              <Link to="/wishlist" onClick={handleMenuItemClick}>
                <FaHeart className="dropdown-icon" />
              </Link>

              <Link to="/stats" onClick={handleMenuItemClick}>
                <IoStatsChart className="dropdown-icon" />
              </Link>
              <button
                className="logout-button"
                onClick={() => {
                  handleLogout();
                  handleMenuItemClick();
                }}
              >
                <IoLogOutOutline className="dropdown-icon logout" />
              </button>
            </div>
          </div>
        </>
      )}
      <Link to="/about" className="about-link" onClick={handleMenuItemClick}>
        <IoMdInformationCircleOutline className="dropdown-icon" />
      </Link>
    </div>
  );
};

export default Navbar;
