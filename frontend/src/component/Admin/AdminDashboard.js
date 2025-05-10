import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import "./AdminDashboard.css";
import { useAuthContext } from "../../hooks/useAuthContext";

const AnimatedNumber = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof value !== "number" && typeof value !== "string") return;

    const numericValue = parseInt(String(value).replace(/,/g, ""), 10) || 0;

    if (count === numericValue) return;

    let duration = 3000;
    let step = Math.ceil(numericValue / (duration / 20));
    let startTime = Date.now();

    let timer = setInterval(() => {
      let elapsedTime = Date.now() - startTime;
      let progress = Math.min(elapsedTime / duration, 1);
      let newValue = Math.floor(progress * numericValue);
      setCount(newValue);

      if (progress >= 1) {
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  return <h2>{count.toLocaleString()}</h2>;
};

const AdminDashboard = () => {
  const { user } = useAuthContext();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://backend.freshimeat.in/products/");
      const json = await response.json();
      if (response.ok) {
        setProducts(json);
      }
    } catch (error) {
      //console.log(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch("https://backend.freshimeat.in/users/");
      const json = await response.json();
      if (response.ok) {
        const filterUsers = json?.filter((us) => us?.userType === "User");
        setUsers(filterUsers);
      }
    } catch (error) {
      //console.log(error);
    }
  };

  const fetchPincodes = async () => {
    try {
      const response = await fetch("https://backend.freshimeat.in/pincodes/");
      const json = await response.json();
      if (response.ok) {
        setPincodes(json);
      }
    } catch (error) {
      //console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://backend.freshimeat.in/orders/");
      const json = await response.json();
      if (response.ok) {
        const total = json.data.reduce((acc, order) => acc + parseFloat(order.billPrice || 0), 0);
        setOrders(json?.data);
        setRevenue(total);
      }
    } catch (error) {
      //console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchOrders();
      fetchCustomers();
      fetchPincodes();
    }
  }, [user]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-row">
        <Link to="/admin" className="dashboard-link">
          <div className="dashboard-card full-width">
            <AnimatedNumber value={revenue} />
            <p>REVENUE</p>
          </div>
        </Link>
        <Link to="/admin/customers" className="dashboard-link">
          <div className="dashboard-card full-width">
            <AnimatedNumber value={users?.length} />
            <p>CUSTOMERS</p>
          </div>
        </Link>
        <Link to="/admin/creatives" className="dashboard-link">
          <div className="dashboard-card full-width">
            <h2>WEBSITE</h2>
            <p>CMS</p>
          </div>
        </Link>
      </div>
      <div className="dashboard-row">
        <Link to="/admin/customer-orders" className="dashboard-link">
          <div className="dashboard-card half-width">
            <AnimatedNumber value={orders?.length} />
            <p>ORDERS</p>
          </div>
        </Link>
        <Link to="/admin/delivery-pricing" className="dashboard-link">
          <div className="dashboard-card half-width">
            <AnimatedNumber value={pincodes?.length} />
            <p>LOCATIONS</p>
          </div>
        </Link>
        <Link to="/admin/products" className="dashboard-link">
          <div className="dashboard-card half-width">
            <AnimatedNumber value={products?.length} />
            <p>PRODUCTS</p>
          </div>
        </Link>
        <Link to="/admin/quick-pricing" className="dashboard-link">
          <div className="dashboard-card half-width">
            <h2>QUICK</h2>
            <p>PRICING</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
