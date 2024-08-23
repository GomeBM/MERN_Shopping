// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaShoppingCart, FaHeart } from "react-icons/fa";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { IoLogOutOutline, IoStatsChart, IoClose } from "react-icons/io5";
// import { GiHamburgerMenu } from "react-icons/gi";
// import {
//   IoMdInformationCircleOutline,
//   IoMdAddCircleOutline,
// } from "react-icons/io";
// import { GrUpdate } from "react-icons/gr";
// import { ReactComponent as Logo } from "../assets/gambashop.svg";
// import "./Navbar.css";

// export const Navbar = ({ userEmail, isUserAdmin, updateUserState }) => {
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false);
//   const [isNavbarOpen, setIsNavbarOpen] = useState(false);
//   const navigate = useNavigate();
//   const userMenuRef = useRef(null);
//   const infoMenuRef = useRef(null);

//   const handleLogout = () => {
//     window.localStorage.removeItem("userName");
//     window.localStorage.removeItem("userEmail");
//     window.localStorage.removeItem("isAdmin");
//     updateUserState(null, false);
//     navigate("/");
//     window.location.reload();
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         userMenuRef.current &&
//         !userMenuRef.current.contains(event.target) &&
//         infoMenuRef.current &&
//         !infoMenuRef.current.contains(event.target)
//       ) {
//         setIsUserMenuOpen(false);
//         setIsInfoMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isUserMenuOpen, isInfoMenuOpen]);

//   const handleMenuItemClick = () => {
//     setIsUserMenuOpen(false);
//     setIsInfoMenuOpen(false);
//   };

//   const handleHamburgerClick = () => {
//     setIsNavbarOpen(!isNavbarOpen);
//   };

//   return (
//     <div className="navbar">
//       {!isNavbarOpen && (
//         <GiHamburgerMenu
//           className="hamburger-menu-closed"
//           onClick={handleHamburgerClick}
//         />
//       )}
//       <Link to="/">
//         <Logo className="gambashop-logo" />
//       </Link>
//       <Link to="/cart" onClick={handleMenuItemClick}>
//         <FaShoppingCart className="dropdown-icon" />
//       </Link>
//       {!userEmail ? (
//         <>
//           <Link to="/login" className="auth-text">
//             Login
//           </Link>
//           <Link to="/register" className="auth-text">
//             Register
//           </Link>
//         </>
//       ) : (
//         <>
//           <div className="user-controls" ref={userMenuRef}>
//             <button
//               className="user-controls-button"
//               onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//             >
//               <FaRegCircleUser className="dropdown-icon" />
//             </button>
//             <div
//               className={`user-controls-menu ${isUserMenuOpen ? "show" : ""}`}
//             >
//               {!isUserAdmin && (
//                 <Link to="/wishlist" onClick={handleMenuItemClick}>
//                   <FaHeart className="dropdown-icon" />
//                 </Link>
//               )}
//               {isUserAdmin && (
//                 <Link to="/add-product" onClick={handleMenuItemClick}>
//                   <IoMdAddCircleOutline className="dropdown-icon" />
//                 </Link>
//               )}
//               {isUserAdmin && (
//                 <Link to="/update-product" onClick={handleMenuItemClick}>
//                   <GrUpdate className="dropdown-icon" />
//                 </Link>
//               )}
//               <Link to="/stats" onClick={handleMenuItemClick}>
//                 <IoStatsChart className="dropdown-icon" />
//               </Link>
//               <button
//                 className="logout-button"
//                 onClick={() => {
//                   handleLogout();
//                   handleMenuItemClick();
//                 }}
//               >
//                 <IoLogOutOutline className="dropdown-icon logout" />
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//       <div className="info-controls" ref={infoMenuRef}>
//         <button
//           className="info-controls-button"
//           onClick={() => setIsInfoMenuOpen(!isInfoMenuOpen)}
//         >
//           <IoMdInformationCircleOutline className="dropdown-icon" />
//         </button>
//         <div className={`info-controls-menu ${isInfoMenuOpen ? "show" : ""}`}>
//           <Link to="/about" onClick={handleMenuItemClick}>
//             About
//           </Link>
//           <Link to="/contact" onClick={handleMenuItemClick}>
//             Contact
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoLogOutOutline, IoStatsChart, IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  IoMdInformationCircleOutline,
  IoMdAddCircleOutline,
} from "react-icons/io";
import { GrUpdate } from "react-icons/gr";
import { ReactComponent as Logo } from "../assets/gambashop.svg";
import "./Navbar.css";

export const Navbar = ({ userEmail, isUserAdmin, updateUserState }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const infoMenuRef = useRef(null);

  const handleLogout = () => {
    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("userEmail");
    window.localStorage.removeItem("isAdmin");
    updateUserState(null, false);
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        infoMenuRef.current &&
        !infoMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
        setIsInfoMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen, isInfoMenuOpen]);

  const handleMenuItemClick = () => {
    setIsUserMenuOpen(false);
    setIsInfoMenuOpen(false);
    setIsNavbarOpen(false);
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <div className={`navbar ${isNavbarOpen ? "open" : ""}`}>
      <button className="hamburger-menu-closed" onClick={toggleNavbar}>
        <GiHamburgerMenu />
      </button>
      <button className="close-menu" onClick={toggleNavbar}>
        <IoClose />
      </button>
      <Link to="/" onClick={handleMenuItemClick}>
        <Logo className="gambashop-logo" />
      </Link>
      <Link to="/cart" onClick={handleMenuItemClick}>
        <FaShoppingCart className="dropdown-icon" />
      </Link>
      {!userEmail ? (
        <>
          <Link to="/login" className="auth-text" onClick={handleMenuItemClick}>
            Login
          </Link>
          <Link
            to="/register"
            className="auth-text"
            onClick={handleMenuItemClick}
          >
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
              {!isUserAdmin && (
                <Link to="/wishlist" onClick={handleMenuItemClick}>
                  <FaHeart className="dropdown-icon" />
                </Link>
              )}
              {isUserAdmin && (
                <Link to="/add-product" onClick={handleMenuItemClick}>
                  <IoMdAddCircleOutline className="dropdown-icon" />
                </Link>
              )}
              {isUserAdmin && (
                <Link to="/update-product" onClick={handleMenuItemClick}>
                  <GrUpdate className="dropdown-icon" />
                </Link>
              )}
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
