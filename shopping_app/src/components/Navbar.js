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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false); // New state for the info menu
  const navigate = useNavigate();
  const userMenuRef = useRef(null); // Ref for the user menu
  const infoMenuRef = useRef(null); // Ref for the info menu

  const handleLogout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("userEmail");
    navigate("/"); // Navigate to home page
    window.location.reload(); // Reload the page
  };

  // Handle click outside to close the user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        infoMenuRef.current &&
        !infoMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
        setIsInfoMenuOpen(false); // Close info menu when clicking outside
      }
    };

    // Add event listener when menus are open
    if (isUserMenuOpen || isInfoMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen, isInfoMenuOpen]);

  const handleMenuItemClick = () => {
    setIsUserMenuOpen(false); // Close the user menu when a menu item is clicked
    setIsInfoMenuOpen(false); // Close the info menu when a menu item is clicked
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
          <div className="user-controls" ref={userMenuRef}>
            <button
              className="user-controls-button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <FaRegCircleUser className="dropdown-icon" />
            </button>
            <div
              className={`user-controls-menu ${isUserMenuOpen ? "show" : ""}`}
            >
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
      <div className="info-controls" ref={infoMenuRef}>
        <button
          className="info-controls-button"
          onClick={() => setIsInfoMenuOpen(!isInfoMenuOpen)}
        >
          <IoMdInformationCircleOutline className="dropdown-icon" />
        </button>
        <div className={`info-controls-menu ${isInfoMenuOpen ? "show" : ""}`}>
          <Link to="/about" onClick={handleMenuItemClick}>
            About
          </Link>
          <Link to="/contact" onClick={handleMenuItemClick}>
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
