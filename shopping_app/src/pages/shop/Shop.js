import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import ProductList from "../../components/ProductList";
import Popup from "../../components/Popup";
import "./Shop.css";

export const Shop = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showPopup, setShowPopup] = useState({
    show: false,
    message: "",
    productImage: null,
  });
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showRatingFilter, setShowRatingFilter] = useState(false);
  const [showCategoriesFilter, setShowCategoriesFilter] = useState(false);
  const [showSearchFilter, setShowSearchFilter] = useState(false); // New state for search filter visibility
  const limit = 9;

  useEffect(() => {
    if (cookies.access_token) {
      const storedUserName = window.localStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
    fetchAllProducts();
  }, [cookies.access_token]);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/productsDB");
      const data = await response.json();
      setAllProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setAllProducts([]);
      setFilteredProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const applyFilters = () => {
      let result = allProducts;

      if (searchTerm) {
        result = result.filter((product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedCategories.length > 0) {
        result = result.filter((product) =>
          selectedCategories.includes(product.category)
        );
      }

      if (minPrice) {
        result = result.filter(
          (product) => product.price >= parseFloat(minPrice)
        );
      }

      if (maxPrice) {
        result = result.filter(
          (product) => product.price <= parseFloat(maxPrice)
        );
      }

      if (rating) {
        result = result.filter(
          (product) => product.rating >= parseFloat(rating)
        );
      }

      setFilteredProducts(result);
      setPage(1);
    };

    applyFilters();
  }, [selectedCategories, minPrice, maxPrice, rating, searchTerm, allProducts]);

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAddToCart = (product) => {
    const userName = window.localStorage.getItem("userName");
    if (!userName) {
      setShowPopup({
        show: true,
        message: "Please log in to add items to your cart",
        productImage: null,
      });
    } else {
      setShowPopup({
        show: true,
        message: `${product.title} has been added to your cart`,
        productImage: product.thumbnail,
      });
    }
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setSearchTerm(""); // Clear search term as well
    setSelectedCategories([]);
  };

  const toggleFilterVisibility = (filter) => {
    if (filter === "price") {
      setShowPriceFilter(!showPriceFilter);
    } else if (filter === "rating") {
      setShowRatingFilter(!showRatingFilter);
    } else if (filter === "categories") {
      setShowCategoriesFilter(!showCategoriesFilter);
    } else if (filter === "search") {
      setShowSearchFilter(!showSearchFilter);
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * limit,
    page * limit
  );

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

      <div className="filter-section">
        <div className="filter-group">
          <h4
            onClick={() => toggleFilterVisibility("search")}
            className={`filter-label ${showSearchFilter ? "active" : ""}`}
          >
            Filter products by NAME
          </h4>
          {showSearchFilter && (
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search by product name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="filter-group">
          <h4
            onClick={() => toggleFilterVisibility("price")}
            className={`filter-label ${showPriceFilter ? "active" : ""}`}
          >
            Filter products by PRICE
          </h4>
          {showPriceFilter && (
            <div className="price-filter">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="filter-group">
          <h4
            onClick={() => toggleFilterVisibility("rating")}
            className={`filter-label ${showRatingFilter ? "active" : ""}`}
          >
            Filter products by RATING
          </h4>
          {showRatingFilter && (
            <div className="rating-filter">
              <input
                type="number"
                placeholder="Minimum Rating"
                min="0"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="filter-group">
          <h4
            onClick={() => toggleFilterVisibility("categories")}
            className={`filter-label ${showCategoriesFilter ? "active" : ""}`}
          >
            Filter products by CATEGORY
          </h4>
          {showCategoriesFilter && (
            <div className="filter-options">
              {[
                "smartphones",
                "beauty",
                "groceries",
                "fragrances",
                "furniture",
                "home-decoration",
                "kitchen-accessories",
                "laptops",
                "mens-shirts",
                "mens-shoes",
                "mens-watches",
                "mobile-accessories",
                "motorcycle",
                "skin-care",
                "sports-accessories",
                "sunglasses",
                "tablets",
                "vehicle",
                "womens-watches",
                "womens-jewellery",
              ].map((category) => (
                <button
                  key={category}
                  className={`filter-button ${
                    selectedCategories.includes(category) ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.replace("-", " ")}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {!loading && paginatedProducts.length > 0 ? (
        <ProductList
          products={paginatedProducts}
          popUpCheck={handleAddToCart}
        />
      ) : (
        <p>No products available</p>
      )}

      {filteredProducts.length > limit && (
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {showPopup.show && (
        <Popup
          message={showPopup.message}
          productImage={showPopup.productImage}
          onClose={() =>
            setShowPopup({ show: false, message: "", productImage: "" })
          }
        />
      )}
    </div>
  );
};

export default Shop;
