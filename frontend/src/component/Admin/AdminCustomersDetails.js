import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import "./AdminOrders.css";
import "./AdminCustomersDetails.css";
import AdminCustDetMobile from "./AdminCustDetMobile"; // Importing the mobile version
import { useAuthContext } from "../../hooks/useAuthContext";

const AdminCustomersDetails = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const ordersPerPage = 15;


  const [users, setUsers] = useState([]); 
  const [bills, setBills] = useState([]); 

  const { user } = useAuthContext();

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:4001/users`);
      const json = await response.json();
      if (response.ok) {
        const filteredUsers = json?.filter(user => user.userType !== "Admin"); // Exclude admins
        const sortedCusts = filteredUsers?.sort((a, b) => {
          // Sorting logic: You can customize this logic as per your need
          if (a.createdAt === b.createdAt) return 0;
          return a.createdAt > b.createdAt ? -1 : 1;
        });
        setUsers(sortedCusts);
        console.log(sortedCusts);
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const fetchBills = async () => {
    try {
      // Fetch bills
      const response = await fetch(`http://localhost:4001/orders`);
      const json = await response.json();
      if (response.ok) {
        setBills(json);
        console.log('Fetched Bills:', json);
      } else {
        console.error('Failed to fetch bills:', json);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.userType === "Admin") {
      fetchUsers();
      fetchBills();
    }
  }, [user]);
  // Search filter function
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };
  

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const userId = user?.userId ? user.userId.toString().toLowerCase() : "";
    const username = user?.username ? user.username.toLowerCase() : "";
    return userId.includes(searchQuery) || username.includes(searchQuery);
  });
  
  

  // Calculate the total spent and total number of orders for each user
  const calculateTotalSpentAndOrders = (userId) => {
    const userBills = bills?.data?.filter((bill) => bill?.userId?._id === userId);
    const totalSpent = userBills?.reduce((acc, bill) => acc + parseFloat(bill?.billPrice), 0);
    const totalOrders = userBills?.length;
    return { totalSpent, totalOrders };
  };

  const totalPages = Math.ceil(filteredUsers.length / ordersPerPage);

  const toggleOrderDetails = (orderId) => {
    setActiveOrder(activeOrder === orderId ? null : orderId);
  };

  const paginateOrders = (orders, currentPage, ordersPerPage) => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    return orders.slice(startIndex, startIndex + ordersPerPage);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setActiveOrder(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 450);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatAddress = (address) => {
    return `${address?.firstName} ${address?.lastName}, ${address?.address}, ${address?.landmark}, ${address?.city}, ${address?.state}, ${address?.pincode}`;
  };

   const calculateAge = (dob) => {
        if (!dob) return ""; // Handle empty or undefined values gracefully
      
        const birthDate = new Date(dob); // Parse the date directly
        if (isNaN(birthDate.getTime())) return ""; // Ensure it's a valid date
      
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
      
        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }
      
        return age;
      };
      
  
      

  return (
    <div className="admin-orders">
      {/* Search Bar */}
      <div className="search-bar srch">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
        />
        <FiSearch className="search-icon" />
      </div>

      {isMobile ? (
        <AdminCustDetMobile orders={filteredUsers} currentPage={currentPage} ordersPerPage={ordersPerPage} />
      ) : (
        <>
          <div className="orders-list">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer ID</th>
                  <th>Customer Name</th>
                  <th>Address</th>
                  <th>Total Spent</th>
                  <th>No. of Orders</th>
                </tr>
              </thead>
              <tbody>
                {paginateOrders(filteredUsers, currentPage, ordersPerPage).map((user, index) => {
                  const { totalSpent, totalOrders } = calculateTotalSpentAndOrders(user._id);
                  return (
                    <React.Fragment key={user._id}>
                      <tr
                        onClick={() => toggleOrderDetails(user._id)}
                        className={`order-row ${activeOrder === user._id ? "active-order" : ""}`}
                      >
                        <td>{index + 1 + (currentPage - 1) * ordersPerPage}</td>
                        <td>{user?.userId}</td>
                        <td>{user?.username}</td>
                        <td>{user?.addresses?.[0] ? formatAddress(user?.addresses?.[0]) : "-"}</td>
                        <td>₹{totalSpent}</td>
                        <td>{totalOrders}</td>
                      </tr>
                      {activeOrder === user._id && (
                        <tr className={`order-details-row ${activeOrder === user._id ? "active-order-details" : ""}`}>
                          <td colSpan="6">
                            <div className="admin-order-details">
                              <div className="admin-customer-details">
                                <h3>Customer Details</h3>
                                <p><strong>Name:</strong> {user?.username}</p>
                                <p><strong>Customer ID:</strong> {user?.userId}</p>
                                <p><strong>Contact:</strong> {user?.addresses?.[0]?.phoneNo}</p>
                                <p><strong>Email:</strong> {user?.email}</p>
                                <p><strong>Gender:</strong> {user?.gender}</p>
                                <p><strong>Age:</strong> {calculateAge(user?.age)? calculateAge(user?.age) : user?.age}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span>
              Showing {ordersPerPage * (currentPage - 1) + 1} -{" "}
              {Math.min(ordersPerPage * currentPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} Users
            </span>
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
        </>
      )}
    </div>
  );
};

export default AdminCustomersDetails;
