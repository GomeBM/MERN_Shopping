import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import ProductList from "../../components/ProductList";
import "./Shop.css";

export const Shop = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // State to track selected category

  useEffect(() => {
    if (cookies.access_token) {
      const storedUserName = window.localStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }

    const fetchAllProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000");
        const data = await response.json();
        setFetchedProducts(data.products);
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    const fetchProductByCategory = async (category) => {
      try {
        const response = await fetch(`http://localhost:4000/${category}`);
        const data = await response.json();
        setFetchedProducts(data.products);
      } catch (error) {
        console.error(
          `Error fetching products for category ${category}:`,
          error
        );
      }
    };

    // Fetch products based on selected category or fetch all products if no category is selected
    selectedCategory
      ? fetchProductByCategory(selectedCategory)
      : fetchAllProducts();

    setLoading(false); // Set loading to false after checking cookies and localStorage
  }, [cookies.access_token, selectedCategory]); // useEffect runs whenever cookies.access_token or selectedCategory changes

  // Function to handle button click for category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  return (
    <div className="shop">
      <h1>The Gambashop!</h1>
      <div className="shop-title">
        {loading ? (
          <h1>Loading</h1>
        ) : cookies.access_token ? (
          <h1>Hello {userName}</h1>
        ) : (
          <h3>Please log in to view your cart</h3>
        )}
      </div>
      <div className="filter-options">
        <button
          className={`filter-button ${
            selectedCategory === "smartphones" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("smartphones")}
        >
          Smartphones
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "beauty" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("beauty")}
        >
          Beauty
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "groceries" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("groceries")}
        >
          Groceries
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "fragrances" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("fragrances")}
        >
          Fragrances
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "furniture" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("furniture")}
        >
          Furniture
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "home-decoration" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("home-decoration")}
        >
          Home Decoration
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "kitchen-accessories" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("kitchen-accessories")}
        >
          Kitchen Accessories
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "laptops" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("laptops")}
        >
          Laptops
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "mens-shirts" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("mens-shirts")}
        >
          Mens Shirts
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "mens-shoes" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("mens-shoes")}
        >
          Mens Shoes
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "mens-watches" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("mens-watches")}
        >
          Mens Watches
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "mobile-accessories" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("mobile-accessories")}
        >
          Mobile Accessories
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "motorcycle" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("motorcycle")}
        >
          Motorcycle
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "skin-care" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("skin-care")}
        >
          Skin Care
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "sports-accessories" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("sports-accessories")}
        >
          Sports Accessories
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "sunglasses" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("sunglasses")}
        >
          Sunglasses
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "tablets" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("tablets")}
        >
          Tablets
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "vehicle" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("vehicle")}
        >
          Vehicle
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "womens-watches" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("womens-watches")}
        >
          Womens Watches
        </button>
        <button
          className={`filter-button ${
            selectedCategory === "womens-jewellery" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("womens-jewellery")}
        >
          Womens Jewellery
        </button>
      </div>
      <ProductList products={fetchedProducts} />
    </div>
  );
};

export default Shop;
