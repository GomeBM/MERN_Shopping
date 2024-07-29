// import React, { useState, useEffect } from "react";
// import { useCookies } from "react-cookie";
// import ProductList from "../../components/ProductList";
// import Popup from "../../components/Popup"; // Ensure correct path to Popup component
// import "./Shop.css";

// export const Shop = () => {
//   const [userName, setUserName] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [cookies, setCookies] = useCookies(["access_token"]);
//   const [fetchedProducts, setFetchedProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null); // State to track selected category
//   const [showPopup, setShowPopup] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const limit = 8; // Number of products per page

//   useEffect(() => {
//     if (cookies.access_token) {
//       const storedUserName = window.localStorage.getItem("userName");
//       if (storedUserName) {
//         setUserName(storedUserName);
//       }
//     }

//     const fetchProducts = async () => {
//       if (!selectedCategory) {
//         setLoading(true);
//         fetchAllProducts(page, limit);
//         setLoading(false);
//       } else {
//         setLoading(true);
//         fetchProductByCategory(selectedCategory);
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [cookies.access_token, selectedCategory, page]); // useEffect runs whenever cookies.access_token, selectedCategory, or page changes

//   const handleCategoryClick = (category) => {
//     setSelectedCategory(category === selectedCategory ? null : category);
//     setPage(1); // Reset to first page when category changes
//   };

//   const handleAddToCart = () => {
//     const userName = window.localStorage.getItem("userName");
//     if (!userName) {
//       setShowPopup(true);
//     } else {
//       // Add the product to the cart logic here
//     }
//   };

//   const totalPages = Math.ceil(totalProducts / limit);

//   const fetchAllProducts = async (page = 1, limit = 20) => {
//     try {
//       const response = await fetch(
//         `http://localhost:4000/productsDB?page=${page}&limit=${limit}`
//       );
//       const data = await response.json();

//       // Check if the data format is correct
//       if (!data || !Array.isArray(data.products)) {
//         throw new Error("Unexpected response format");
//       }

//       console.log("Fetched products data:", data); // Log the data received from API
//       setFetchedProducts(data.products);
//       setTotalProducts(data.totalProducts);
//     } catch (error) {
//       console.error("Error fetching all products:", error);
//     }
//   };

//   const fetchProductByCategory = async (category) => {
//     try {
//       const response = await fetch(`http://localhost:4000/${category}?page=${page}&limit=${limit}`);
//       const data = await response.json();
//       setFetchedProducts(data.products);
//       setTotalProducts(data.totalProducts);
//     } catch (error) {
//       console.error(`Error fetching products for category ${category}:`, error);
//     }
//   };

//   return (
//     <div className="shop">
//       <h1>The Gambashop!</h1>
//       <div className="shop-title">
//         {loading ? (
//           <h1>Loading</h1>
//         ) : cookies.access_token ? (
//           <h1>Hello {userName}</h1>
//         ) : (
//           <h3>Please log in to view your cart</h3>
//         )}
//       </div>
//       <div className="filter-options">
//         <button
//           className={`filter-button ${
//             selectedCategory === "smartphones" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("smartphones")}
//         >
//           Smartphones
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "beauty" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("beauty")}
//         >
//           Beauty
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "groceries" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("groceries")}
//         >
//           Groceries
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "fragrances" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("fragrances")}
//         >
//           Fragrances
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "furniture" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("furniture")}
//         >
//           Furniture
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "home-decoration" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("home-decoration")}
//         >
//           Home Decoration
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "kitchen-accessories" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("kitchen-accessories")}
//         >
//           Kitchen Accessories
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "laptops" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("laptops")}
//         >
//           Laptops
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "mens-shirts" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("mens-shirts")}
//         >
//           Mens Shirts
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "mens-shoes" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("mens-shoes")}
//         >
//           Mens Shoes
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "mens-watches" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("mens-watches")}
//         >
//           Mens Watches
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "mobile-accessories" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("mobile-accessories")}
//         >
//           Mobile Accessories
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "motorcycle" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("motorcycle")}
//         >
//           Motorcycle
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "skin-care" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("skin-care")}
//         >
//           Skin Care
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "sports-accessories" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("sports-accessories")}
//         >
//           Sports Accessories
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "sunglasses" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("sunglasses")}
//         >
//           Sunglasses
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "tablets" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("tablets")}
//         >
//           Tablets
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "vehicle" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("vehicle")}
//         >
//           Vehicle
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "womens-watches" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("womens-watches")}
//         >
//           Womens Watches
//         </button>
//         <button
//           className={`filter-button ${
//             selectedCategory === "womens-jewellery" ? "active" : ""
//           }`}
//           onClick={() => handleCategoryClick("womens-jewellery")}
//         >
//           Womens Jewellery
//         </button>
//       </div>
//       <ProductList products={fetchedProducts} popUpCheck={handleAddToCart} />
//       {totalProducts > limit && (
//         <div className="pagination">
//           <button onClick={() => setPage(page - 1)} disabled={page === 1}>
//             Previous
//           </button>
//           <span>
//             Page {page} of {totalPages}
//           </span>
//           <button
//             onClick={() => setPage(page + 1)}
//             disabled={page === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}
//       {showPopup && (
//         <Popup
//           message="Please log in to add items to your cart"
//           onClose={() => setShowPopup(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Shop;

import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import ProductList from "../../components/ProductList";
import Popup from "../../components/Popup";
import "./Shop.css";

export const Shop = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showPopup, setShowPopup] = useState({ show: false, message: "" });
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 8;

  useEffect(() => {
    if (cookies.access_token) {
      const storedUserName = window.localStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }

    const fetchProducts = async () => {
      if (!selectedCategory) {
        setLoading(true);
        fetchAllProducts(page, limit);
        setLoading(false);
      } else {
        setLoading(true);
        fetchProductByCategory(selectedCategory);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cookies.access_token, selectedCategory, page]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setPage(1);
  };

  const handleAddToCart = (product) => {
    const userName = window.localStorage.getItem("userName");
    if (!userName) {
      setShowPopup({
        show: true,
        message: "Please log in to add items to your cart",
      });
    } else {
      // Add the product to the cart logic here
      // Example: Add product to cart in the backend or local storage

      // Show confirmation popup
      setShowPopup({
        show: true,
        message: `${product.title} has been added to your cart`,
      });
    }
  };

  const totalPages = Math.ceil(totalProducts / limit);

  const fetchAllProducts = async (page = 1, limit = 20) => {
    try {
      const response = await fetch(
        `http://localhost:4000/productsDB?page=${page}&limit=${limit}`
      );
      const data = await response.json();

      if (!data || !Array.isArray(data.products)) {
        throw new Error("Unexpected response format");
      }

      setFetchedProducts(data.products);
      setTotalProducts(data.totalProducts);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const fetchProductByCategory = async (category) => {
    try {
      const response = await fetch(
        `http://localhost:4000/${category}?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      setFetchedProducts(data.products);
      setTotalProducts(data.totalProducts);
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
    }
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
      <ProductList products={fetchedProducts} popUpCheck={handleAddToCart} />
      {totalProducts > limit && (
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
          onClose={() => setShowPopup({ show: false, message: "" })}
        />
      )}
    </div>
  );
};

export default Shop;
