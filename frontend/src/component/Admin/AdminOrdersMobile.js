import React, { useState } from "react";
import "./AdminOrdersMobile.css";
import { FiSearch, FiFilter } from "react-icons/fi";

const AdminOrdersMobile = ({ orders }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 15;
  const [filter, setFilter] = useState("All");

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const toggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleFilterClick = (status) => {
    setFilter(status);
    setCurrentPage(1);
  };

  const filterOrders = (orders, filter) => {
    if (filter === "All") return orders;
    return orders.filter((order) => order.status === filter);
  };

  const paginateOrders = (orders, currentPage, ordersPerPage) => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    return orders.slice(startIndex, startIndex + ordersPerPage);
  };

  const filteredOrders = filterOrders(orders, filter);
  const paginatedOrders = paginateOrders(filteredOrders, currentPage, ordersPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedOrderId(null);
  };
   const [searchQuery, setSearchQuery] = useState("");
  
    const handleSearch = (event) => {
      setSearchQuery(event.target.value);
    };

  return (
    <div className="orders-list-mobile">
      <div className="search-bar sb">
                              <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={handleSearch}
                              />
                              <FiSearch className="search-icon" />
                            </div>
      {/* Orders Navigation */}
      <div className="orders-navigation">
        <button className={filter === "All" ? "active" : ""} onClick={() => handleFilterClick("All")}>
          All Orders
        </button>
        <button className={filter === "Delivered" ? "active" : ""} onClick={() => handleFilterClick("Delivered")}>
          Completed
        </button>
        <button className={filter === "Pending" ? "active" : ""} onClick={() => handleFilterClick("Pending")}>
          Pending
        </button>
        <button className={filter === "Canceled" ? "active" : ""} onClick={() => handleFilterClick("Canceled")}>
          Canceled
        </button>
      </div>

      {/* Orders List */}
      {paginatedOrders.map((order) => (
        <div key={order.id} className="order-container">
          {/* Minimal details shown initially */}
          <div className="order-row-mobile" onClick={() => toggleDetails(order.id)}>
            <p><strong>Order Date:</strong> {order.date}</p>
            <p><strong>Product:</strong> {order.productName}</p>
            <p><strong>Status:</strong>
              <button className={`status-button ${order.status}`}>{order.status}</button>
            </p>
          </div>

          {/* Expanded details */}
          {expandedOrderId === order.id && (
            <div className="order-details-row-mobile">
              {/* Customer Details */}
              <div className="customer-details">
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> {order.customer.name}</p>
                <p><strong>Customer ID:</strong> {order.customer.customerId}</p>
                <p><strong>Contact:</strong> {order.customer.contact}</p>
                <p><strong>Email:</strong> {order.customer.email}</p>
                <p><strong>Payment Method:</strong> {order.customer.paymentMethod}</p>
                <p><strong>Delivery Date:</strong> {order.deliveryDate}</p>
                <p>
                  <strong>Delivery:</strong> Today, {order.deliveryDetails.date}, {order.deliveryDetails.time}, {order.deliveryDetails.duration}
                </p>
              </div>

              {/* Address, Date, and Price */}
              <div className="order-extra-details">
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Total Price:</strong> ₹{parseFloat(order.price).toFixed(2)}</p>
              </div>

              {/* Order Items */}
              <div className="order-items-mobile">
                <h3>Order Details</h3>
                <p className="orderID"><strong>Order ID:</strong> {order.id}</p>
                {order.orderDetails.map((item) => (
                  <div key={item.id} className="order-item-mobile">
                    <div className="image-container">
                      {item.images.map((image, imgIndex) => (
                        <img key={imgIndex} src={image} alt={`${item.name} ${imgIndex + 1}`} className="order-item-image-mobile" />
                      ))}
                    </div>
                    <div className="order-item-details-mobile">
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Update Order Status */}
              <div className="update-status">
                <h3>Update Order Status</h3>
                <button className="Pending">Pending</button>
                <button className="Delivered">Delivered</button>
                <button className="Canceled">Canceled</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      <div className="pagination">
        <button
          className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`pagination-btn ${currentPage === i + 1 ? "active-page" : ""}`}
            onClick={() => handlePageClick(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOrdersMobile;
