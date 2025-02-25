import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiFilter } from "react-icons/fi";
import { FaArchive } from "react-icons/fa"; // Archive icon
import "./AdminProducts.css";
import productImage1 from "../../assets/fishimage.png";
import productImage2 from "../../assets/fishimage.png";
import FilterComponent from "./FilterComponent"; // Import the Filter Component
import { useAuthContext } from "../../hooks/useAuthContext";

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 50;
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Filter pop-up state
  const {user} = useAuthContext();
  const [products, setProducts] = useState([])
  const [archProd, setArchProd] = useState(false)
  const [prd, setPrd] = useState('')

  const fetchProducts = async()=>{
    try{
      const response = await fetch('http://localhost:4001/products/');
      const json = await response.json();
      if(response.ok)
      {
        console.log(json)
        setProducts(json)
      }
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    if(user)
    {
      fetchProducts();
    }
  },[user])


  // Handle Search Input
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter products based on search query, archive status, and selected product tag
const filteredProducts = products.filter((product) => {
  // Ensure product name matches the search query
  const matchesSearch = product?.name?.toLowerCase().includes(searchQuery.toLowerCase());

  // Show only archived or non-archived products based on archProd state
  const matchesArchive = archProd ? product.isArchived : !product.isArchived;

  // Filter based on selected product tag (if any)
  const matchesTag = prd ? product?.productTag === prd : true; // Assuming each product has a `tag` property

  return matchesSearch && matchesArchive && matchesTag;
});

const handleProductTag = (tag) => {
  setPrd(prd === tag ? null : tag); // Toggle selection on double click
};


useEffect(() => {
  console.log("Selected product tag:", prd);
}, [prd]);

  

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle Page Change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

 

  return (
    <div className="admin-home-page">
      <div className="main-content">
        {/* Header Section */}
        <div className="admin-products-header">
          {/* <button className="back-button">Back</button> */}

          {/* Search Bar */}
          {archProd && <button onClick={(e)=>setArchProd(false)} className="back-button">Back</button>}
         
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
            <FiSearch className="search-icon" />
          </div>

          {/* Archive & Filter Buttons */}
          <div className="admin-icons">
            <button className="archive-button" onClick={(e)=>setArchProd(true)}>
              <FaArchive />
              Archive
            </button>
            <button className="filter-button" onClick={() => setIsFilterOpen(true)}>
              <FiFilter />
              Filter
            </button>
          </div>
        </div>

        {/* Filter Popup */}
        {isFilterOpen && <FilterComponent onClose={() => setIsFilterOpen(false)}  handleProductTag={handleProductTag} prdt={prd}/>}

        <div className="cakes-grid">
          {/* Add Product Button */}
          {!archProd && (
            <Link to="/admin/add-product" style={{ textDecoration: "none" }}>
            <div className="add-product-card">
              <button className="add-product-button">+ Add New Product</button>
            </div>
          </Link>
          )}
          

          {/* Product Cards */}
          {displayedProducts?.map((product, index) => (
            <div key={index} className="product-card">
<img src={`http://localhost:4001/uploads/${product?.images?.[0]}`} alt={product?.name} />
<div className="product-info">
                <h3>{product?.name}</h3>
                <div className="product-bottom">
                  <div className="price-info">
                    <span className="current-price">₹{product?.price?.sale}</span>
                    <span className="old-price">₹{product?.price?.default}</span>
                    <div className="weight">{product?.weight} g</div>
                  </div>
                  <Link to={`/admin/edit-product/${product?._id}`} style={{ textDecoration: "none" }}>
                    <button className="add-btn">Edit</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <p className="pagination-text">
            Showing {endIndex > filteredProducts.length ? filteredProducts.length : endIndex} of {filteredProducts.length} Products
          </p>
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
