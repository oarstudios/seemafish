import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./component/Navbar/Navbar";
import Footer from "./component/Footer/Footer";
import ScrollToTop from "./component/ScrollToTop";
import loader from './assets/Fish_Animation.gif'

// User Components
import SliderComponent from "./component/Slider/SliderComponent";
import CategorySection from "./component/CategorySection/CategorySection";
import BestSellers from "./component/BestSellers/BestSellers";
import ShopByPrice from "./component/ShopByPrice/ShopByPrice";
import FlashDeal from "./component/FlashDeal/FlashDeal";
import DealOfTheDay from "./component/DealOfTheDay/DealOfTheDay";
import AboutUs from "./component/AboutUs/AboutUs";

// Admin Components
import AdminNavbar from "./component/Admin/AdminNavbar";
import AdminProducts from "./component/Admin/AdminProducts";
import AddNewProduct from "./component/Admin/AddNewProduct";
import EditAdminProducts from "./component/Admin/EditAdminProducts";
import AdminOrders from "./component/Admin/AdminOrders";
import AdminCustomersDetails from "./component/Admin/AdminCustomersDetails";
import AdminDashboard from "./component/Admin/AdminDashboard";
import QuickPricing from "./component/Admin/QuickPricing";
import DeliveryPricing from "./component/Admin/DeliveryPricing";
import Creatives from "./component/Admin/Creatives";

// Product Page Components
import MainProductPage from "./component/MainProductPage/MainProductPage";

// Scroll to Top Component
import Checkout from "./component/Checkout/Checkout";
import MyAccount from "./component/MyAccount/MyAccount";
import OrderSection from "./component/OrderSection/OrderSection";
import CategoryFull from "./component/CategorySection/CategoryFull";
import { ToastContainer } from "react-toastify";
import Signup from "./component/Signup/Signup";
import { useAuthContext } from "./hooks/useAuthContext";
import ContactUs from "./component/ContactUs/ContactUs";

function App() {
  const [cart, setCart] = useState([]);
  const { user } = useAuthContext();

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:4001/users/${user._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (response.ok) {
        const filteredProducts = data?.cart?.filter(product => !product?.productId?.isArchived);
        setCart(filteredProducts);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, [user?._id, user?.token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const [sOpen, setSOpen] = useState(true);

  const [sgStyle, setSgStyle] = useState({
      "display": "flex",
    })

    useEffect(()=>{
        if(!sOpen)
        {
          setTimeout(() => {
            setSgStyle({
              "display": "none"
            })
          }, 1000);
        }else{
          setSgStyle({
            "display": "flex"
          })
        }
      },[sOpen])

      const [lg, setLg] = useState("flex")
      useEffect(()=>{
        setTimeout(() => {
          setLg("none")
        }, 3000);
      },[])

  return (
    <Router>
      <ScrollToTop />
      <div style={{ display: lg }} className="loader">
  <img src={loader} alt="Loading..." />
</div>

      <div className="App" style={{display: lg === "flex" ? "none": "block"}}>
        <Routes>
          {/* User Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart} />
                <div className="comps">
                  <SliderComponent />
                  <CategorySection />
                  <BestSellers fetchCart={fetchCart} cart={cart} />
                  <ShopByPrice />
                  <FlashDeal fetchCart={fetchCart} cart={cart} />
                  <DealOfTheDay fetchCart={fetchCart} cart={cart} />
                  <AboutUs />
                </div>
                <Footer />
              </>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/product/:id"
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart} />
                <MainProductPage fetchCart={fetchCart} cart={cart} />
                <Footer />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart} />
                <Checkout fetchCart={fetchCart} cart={cart} />
                <Footer />
              </>
            }
          />
           <Route
            path="/about-us"
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart}/>
                <div className="comps">
                  <AboutUs/>
                </div>
                <Footer />
              </>
            }
          />
          <Route
            path="/myaccount"
            element={
              <>
              {user?.userType === "User" ? <Navbar fetchCart={fetchCart} cart={cart}/> : <AdminNavbar />}
                
                
                <div className="comps">
                  <MyAccount />
                </div>
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart}/>
                <div className="comps">
                  <ContactUs />
                </div>
                <Footer />
              </>
            }
          />
          <Route
            path="/order/:id"
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart}/>
                <div className="comps">
                  <OrderSection />
                </div>
                <Footer />
              </>
            }
          />
          <Route
            path="/category/:cat"
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart}/>
                <div className="comps">
                  <CategoryFull fetchCart={fetchCart} cart={cart}/>
                </div>
                <Footer />
              </>
            }
          />
          {/* Admin Routes */}
          {user?.userType === "Admin" ? (
            <Route
              path="/admin/*"
              element={
                <>
                  <AdminNavbar />
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="add-product" element={<AddNewProduct />} />
                    <Route path="edit-product/:id" element={<EditAdminProducts />} />
                    <Route path="customer-orders" element={<AdminOrders />} />
                    <Route path="customers" element={<AdminCustomersDetails />} />
                    <Route path="quick-pricing" element={<QuickPricing />} />
                    <Route path="delivery-pricing" element={<DeliveryPricing />} />
                    <Route path="creatives" element={<Creatives />} />
                  </Routes>
                </>
              }
            />
          ): (
            <Route
            path="/admin"
            element={
              <div className={`sgIn ${sOpen ? "rollDown" : "rollUp"}`} style={sgStyle} onClick={() => setSOpen(false)}>
    <div onClick={(e) => e.stopPropagation()}>
      <Signup />
    </div>
  </div>
            }
            />
          )}
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
