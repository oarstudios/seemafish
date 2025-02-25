import React, { useState } from "react";
import "./AdminOrdersMobile.css";

const AdminCustDetMobile = () => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 15;

  // Mock Users Data
  const users = [
    {
      id: "CUST001",
      name: "Omkar Garate",
      contact: "+91 99888 77666",
      email: "omkar@example.com",
      gender: "Male",
      age: 29,
      totalSpent: "₹4,300",
      orders: 2,
    },
    {
      id: "CUST002",
      name: "Aarav Patel",
      contact: "+91 99888 12345",
      email: "aarav@example.com",
      gender: "Male",
      age: 34,
      totalSpent: "₹3,000",
      orders: 1,
    },
  ];

  const totalPages = Math.ceil(users.length / ordersPerPage);

  const toggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const paginateUsers = (users, currentPage, ordersPerPage) => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    return users.slice(startIndex, startIndex + ordersPerPage);
  };

  const paginatedUsers = paginateUsers(users, currentPage, ordersPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedOrderId(null);
  };

  return (
    <div className="orders-list-mobile">
      {/* Orders List */}
      {paginatedUsers.map((user) => (
        <div key={user.id} className="order-container">
          {/* Minimal details shown initially */}
          <div className="order-row-mobile" onClick={() => toggleDetails(user.id)}>
            <p><strong>Customer Name:</strong> {user.name}</p>
            <p><strong>No. of Orders:</strong> {user.orders}</p>
            <p><strong>Total Spent:</strong> {user.totalSpent}</p>
          </div>

          {/* Expanded details */}
          {expandedOrderId === user.id && (
            <div className="order-details-row-mobile">
              {/* Customer Details */}
              <div className="customer-details">
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Customer ID:</strong> {user.id}</p>
                <p><strong>Contact:</strong> {user.contact}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Age:</strong> {user.age}</p>
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

export default AdminCustDetMobile;
