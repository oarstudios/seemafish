import React, { useEffect, useState } from "react";
import "./QuickPricing.css";
import { FiFilter } from "react-icons/fi";
import FilterComponent from "./FilterComponent";
import { useAuthContext } from "../../hooks/useAuthContext";
import useNotify from "../../hooks/useNotify";

const QuickPricing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const { user } = useAuthContext();
  const [products, setProducts] = useState([]);
  const { notify } = useNotify();
  const [salePrices, setSalePrices] = useState([]);
  const [ftds, setFtds] = useState([])

 

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://backend.freshimeat.in/products/");
      const json = await response.json();
      if (response.ok) {
        setProducts(json);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchFTD = async () => {
    try {
      const response = await fetch("https://backend.freshimeat.in/ftds/");
      const json = await response.json();
      if (response.ok) {
        setFtds(json);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchFTD();
    }
  }, [user]);

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const toggleEditMode = (id, isEditing) => {
    setSalePrices((prev) => ({
      ...prev,
      [id]: isEditing ? products.find((p) => p._id === id)?.price.sale || "" : undefined,
    }));
  };

  const handlePriceChange = (id, newPrice) => {
    setSalePrices((prevPrices) => ({
      ...prevPrices,
      [id]: newPrice,
    }));
  };

  useEffect(()=>{
    console.log(salePrices)
    console.log(ftds)
  },[salePrices, ftds])

  const handleSubmit = async (e, id, dp) => {
    e.preventDefault();

    const salePrice = salePrices[id];

    if (!salePrice || isNaN(Number(salePrice)) || Number(salePrice) >= Number(dp)) {
      return notify("Sale price must be a number and less than the default price", "error");
    }

    const price = {
      default: dp,
      sale: salePrice,
    };

    const formData = new FormData();
    formData.append("price", JSON.stringify(price));

    try {
      const response = await fetch(`https://backend.freshimeat.in/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === id ? { ...product, price: { ...product.price, sale: salePrice } } : product
          )
        );
        notify("Product updated successfully", "success");
        toggleEditMode(id, false);
        fetchProducts();
      } else {
        notify("Error updating the product", "error");
      }
    } catch (error) {
      notify("Error updating the product", "error");
    }
  };

  const makeFishOfTheDay = async (id) => {
    // Check if the product's id is already in the ftds
    const isBestseller = ftds.some(ftd => ftd?.product?._id === id); // Check if any ftd contains the product._id
    
    try {
      const method = isBestseller ? "DELETE" : "POST"; // DELETE if already selected, POST if not
      const url = `https://backend.freshimeat.in/ftds/${isBestseller ? ftds.find(ftd => ftd?.product?._id === id)?._id : ""}`; // DELETE the ftd by its ID if exists
    
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: isBestseller ? null : JSON.stringify({ product: id }), // Include the product id for POST, none for DELETE
      });
    
      if (response.ok) {
        setFtds((prev) =>
          isBestseller
            ? prev.filter((ftd) => ftd.product._id !== id) // Remove the ftd with matching product._id
            : [...prev, { product: { _id: id } }] // Add the new product to ftds
        ); // Optimistic update
        notify("Product updated successfully", "success");
      } else {
        notify("Only 4 products are acceptable for fish of the day.", "error");
      }
    } catch (error) {
      console.log(error);
      notify("Error updating product", "error");
    }
  };


   const [prd, setPrd] = useState('')
  
    // Handle Search Input
    const handleSearch = (event) => {
      setSearchQuery(event.target.value);
    };
  
    // Filter products based on search query, archive status, and selected product tag
  const filteredProducts = products.filter((product) => {
    // Ensure product name matches the search query
    const matchesSearch = product?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  
    // Filter based on selected product tag (if any)
    const matchesTag = prd ? product?.productTag === prd : true; // Assuming each product has a `tag` property
  
    return matchesSearch && matchesTag;
  });
  
  const handleProductTag = (tag) => {
    setPrd(prd === tag ? null : tag); // Toggle selection on double click
  };
  
  
  useEffect(() => {
    console.log("Selected product tag:", prd);
  }, [prd]);
  
  
  
  return (
    <div className="quick-pricing-container">
      <div className="admin-products-header lsp">
        <div className="search-bar">
          <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearch} />
        </div>

        <div className="admin-icons">
          <button className="filter-button" onClick={toggleFilter}>
            <FiFilter /> Filter
          </button>
        </div>
      </div>

      {filterVisible && <FilterComponent onClose={toggleFilter} handleProductTag={handleProductTag} prdt={prd}/>}

      <table className="quick-pricing-table">
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>WEIGHT</th>
            <th>SALE PRICE</th>
            <th>DEAL OF THE DAY</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts?.map((product) => (
            <tr key={product._id}>
              <td className="QP-product-info">
                <img src={`https://backend.freshimeat.in/uploads/${product?.images[0]}`} alt={product.name} className="QP-product-image" />
                <span className="QP-product-name">{product.name}</span>
              </td>
              <td className="QP-product-weight">{product.weight}g</td>
              <td className="QP-product-price">
                <form className="price-box" onSubmit={(e) => handleSubmit(e, product._id, product.price.default)}>
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    value={salePrices[product._id] !== undefined ? salePrices[product._id] : product.price.sale || ""}
                    onChange={(e) => handlePriceChange(product._id, e.target.value)}
                    className="price-input"
                    readOnly={salePrices[product._id] === undefined}
                  />
                  <button
                    type={salePrices[product._id] !== undefined ? "button" : "submit"}
                    className={`edit-btn ${salePrices[product._id] !== undefined ? "apply-btn" : ""}`}
                    onClick={(e) => {
                      if (salePrices[product._id] !== undefined) {
                        handleSubmit(e, product._id, product.price.default);
                      } else {
                        toggleEditMode(product._id, true);
                      }
                    }}
                  >
                    {salePrices[product._id] !== undefined ? "APPLY" : "EDIT"}
                  </button>
                </form>
                <p className="max-price">MAX: ₹{product.price.default}</p>
              </td>
              <td className="bestseller-checkbox">
                <form className="bestseller-checkbox">
                <span className="fish-of-the-day">Deal of the Day:</span>
                <input 
  type="checkbox" 
  checked={ftds.some(ftd => ftd?.product?._id === product?._id)} // Check if product._id is in the ftds array
  onChange={() => makeFishOfTheDay(product?._id)} // Pass the id when checkbox state changes
/>

                </form> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuickPricing;
