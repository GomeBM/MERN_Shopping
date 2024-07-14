// import React, { useEffect, useState } from "react";
// import { PropTypes } from "prop-types";
// import Product from "./Product";

// import "./ProductList.css";

// const ProductList = ({ addLikedProduct }) => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         const response = await fetch("http://localhost:4000");
//         const data = await response.json();
//         setProducts(data.products);
//       } catch (error) {
//         console.error("Error fetching all products:", error);
//       }
//     };
//     fetchAllProducts();
//   }, []);

//   return (
//     <div className="product-list">
//       {products.length > 0 ? (
//         products.map((product) => (
//           <Product key={product.id} product={product} />
//         ))
//       ) : (
//         <p>Loading products</p>
//       )}
//     </div>
//   );
// };

// export default ProductList;

import React, { useEffect, useState } from "react";
import Product from "./Product";

import "./ProductList.css";

const ProductList = ({ products }) => {
  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => (
          <Product key={product.id} product={product} />
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default ProductList;
