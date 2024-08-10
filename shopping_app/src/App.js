import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import { Navbar } from "./components/Navbar";
import { Shop } from "./pages/shop/Shop";
import { Cart } from "./pages/cart/Cart";
import About from "./pages/about/About";
import Stats from "./components/Stats";
import Wishlist from "./pages/wishlist/Wishlist";
import Contact from "./pages/contact/Contact";
import AddProduct from "./components/admin/AddProduct";
import UpdateProduct from "./components/admin/UpdateProduct";

function App() {
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [isUserAdmin, setIsUserAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setUserEmail(localStorage.getItem("userEmail"));
      setIsUserAdmin(localStorage.getItem("isAdmin") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateUserState = (email, isAdmin) => {
    setUserEmail(email);
    setIsUserAdmin(isAdmin);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar
          userEmail={userEmail}
          isUserAdmin={isUserAdmin}
          updateUserState={updateUserState}
        />
        <div className="content">
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route
              path="/login"
              element={<Login updateUserState={updateUserState} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/update-product" element={<UpdateProduct />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
