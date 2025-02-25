import React, { useState, useEffect } from "react";
import "./AdminOrders.css";
import AdminOrdersMobile from "./AdminOrdersMobile"; // Mobile version
import img1 from "../../assets/fishimage.png";
import { FiSearch, FiFilter } from "react-icons/fi";
import useNotify from "../../hooks/useNotify";
import { useAuthContext } from "../../hooks/useAuthContext";

const AdminOrders = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const ordersPerPage = 15;
  const {user} = useAuthContext();

  const [orders, setOrders] = useState([])
  const {notify} = useNotify();
  const [activeFilter, setActiveFilter] = useState("all"); // Track active filter


  const fetchBills = async (status = 'all') => {
    try {
      // Adjust the API URL to fetch bills
      const response = await fetch(`http://localhost:4001/orders`);
  
      const json = await response.json();
      if (response.ok) {
        console.log('Fetched Bills:', json);
  
       
  
        // If you want to filter by a specific status:
        const filteredBills = status === 'all' 
          ? json?.data
          : json?.data?.filter(bill => bill?.status?.toLowerCase() === status?.toLowerCase());
  
           // // Sort the bills based on status
        const sortedBills = filteredBills?.sort((a, b) => {
          // Sorting logic: You can customize this logic as per your need
          if (a.createdAt === b.createdAt) return 0;
          return a.createdAt > b.createdAt ? -1 : 1;
        });

        // Set the state with the sorted (and optionally filtered) bills
        setOrders(sortedBills);
        setActiveFilter(status); // ✅ Set active filter when fetching orders
      } else {
        console.error('Failed to fetch bills:', json);
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(()=>{
    if(user?.userType === "Admin")
    {
      fetchBills();
    }
  },[user])

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const toggleOrderDetails = (orderId) => {
    setActiveOrder(activeOrder === orderId ? null : orderId);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrders = orders?.filter((order) =>
    order?.billId?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const paginateOrders = (filteredOrders, currentPage, ordersPerPage) => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    return filteredOrders?.slice(startIndex, startIndex + ordersPerPage);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setActiveOrder(null);
  };

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 450);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const formatAddress = (address) => {
    return `${address.firstName} ${address.lastName}, ${address.address}, ${address.landmark}, ${address.city}, ${address.state}, ${address.pincode}, Phone: ${address.phoneNo}`;
  };

  const updateBill = async(id, status, userId)=>{

    try{
      const formData = {
        "status": status
      }
  
      const response = await fetch(`http://localhost:4001/orders/${id}/${userId}`,{
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${user?.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
  
      const json = await response.json();
  
      if(response.ok)
      {
        console.log(json)
         notify("Changed the status of order", "success")
        fetchBills();
      }
    }catch(error){
      console.log(error)
      notify("Error changing the status of order", "error")
    }

   
  }

  const formatDay = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString("en-US", {
      month: "short",
    })}`;
  };

  return (
    <div className="admin-orders">
      {isMobile ? (
        <AdminOrdersMobile orders={orders} />
      ) : (
        <>
        
          <div className="orders-navigation">
            <div className="search-bar sb">
                        <input
                          type="text"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                        <FiSearch className="search-icon" />
                      </div>
                      <div className="onSort">
  <button
    className={activeFilter === "all" ? "active" : ""}
    onClick={() => fetchBills("all")}
  >
    All Orders
  </button>
  <button
    className={activeFilter === "Delivered" ? "active" : ""}
    onClick={() => fetchBills("Delivered")}
  >
    Completed
  </button>
  <button
    className={activeFilter === "Pending" ? "active" : ""}
    onClick={() => fetchBills("Pending")}
  >
    Pending
  </button>
  <button
    className={activeFilter === "Canceled" ? "active" : ""}
    onClick={() => fetchBills("Canceled")}
  >
    Canceled
  </button>
</div>

            
          </div>

          <div className="orders-list">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Product Name</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
  {paginateOrders(filteredOrders, currentPage, ordersPerPage)?.map((order, index) => (
    <React.Fragment key={order?._id}>
      <tr
        onClick={() => toggleOrderDetails(order?._id)}
        className={`order-row ${activeOrder === order?._id ? "active-order" : ""}`}
      >
        <td>{index + 1 + (currentPage - 1) * ordersPerPage}</td>
        <td>{order?.billId}</td>
        <td>{order?.products?.map((prd, index) => (
            <span key={index}>{prd?.product?.name + " "}</span>
          ))}</td>
        <td>{formatAddress(order?.shippingAddress)}</td>
        <td>{formatDate(order?.createdAt)}</td>
        <td>{order?.billPrice}</td>
        <td>
          <span className={`status ${order.status.toLowerCase()}`}>{order?.status}</span>
        </td>
      </tr>
      {activeOrder === order?._id && (
        <tr className="order-details-row">
          <td colSpan="7">
            <div className="order-details">
              <div className="customer-details">
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> {order?.userId?.username}</p>
                <p><strong>Customer ID:</strong> {order?.userId?.userId}</p>
                <p><strong>Contact:</strong> {order?.userId?.addresses?.[0]?.phoneNo}</p>
                <p><strong>Email:</strong> {order?.userId?.email}</p>
                <p><strong>Payment Method:</strong> Online</p>
                <p><strong>Delivery Date:</strong>{formatDay(order?.time?.day)}</p>
                <p>
                  <strong>Delivery Time:</strong> {order?.time?.slot}
                </p>
              </div>
              <div className="order-items">
                <h3>Order Details</h3>
                {order?.products?.map((item) => (
                  <div key={item?._id} className="order-item">
                    <img src={`http://localhost:4001/uploads/${item?.product?.images?.[0]}`} alt={item?.product?.name} className="cake-image" />
                    <span>{item?.product?.name}</span>
                    <span>x{item?.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="update-status">
                <h3>Update Order Status</h3>
                <button className="Pending" onClick={()=>updateBill(order?._id, "Pending", order?.userId?._id)}>Pending</button>
                <button className="Delivered" onClick={()=>updateBill(order?._id, "Delivered", order?.userId?._id)}>Delivered</button>
                <button className="Canceled" onClick={()=>updateBill(order?._id, "Canceled", order?.userId?._id)}>Canceled</button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>

            </table>
          </div>

          <div className="pagination">
            <span>
              Showing {ordersPerPage * (currentPage - 1) + 1} -{" "}
              {Math.min(ordersPerPage * currentPage, orders.length)} of{" "}
              {orders.length} Orders
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

export default AdminOrders;

