import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import CartNotification from "./component/CartNotification/CartNotification";
import CartPopup from "./component/CartPopup/CartPopup";

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
import Tnc from "./component/Policies/Tnc";
import PrivacyPolicy from "./component/Policies/PrivacyPolicy";
import RefundPolicy from "./component/Policies/RefundPolicy";
import ContactUsFooter from "./component/Policies/ContactUsFooter";

function App() {
  const [cart, setCart] = useState([]);
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  
  const { user } = useAuthContext();

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`https://backend.freshimeat.in/users/${user._id}`, {
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
  const subtotal = cart?.reduce(
    (acc, item) => acc + (item?.productId?.price?.sale || 0) * item?.quantity,
    0
  );

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

      const [cartNot, setCartNot] = useState(false)

      useEffect(()=>{
        if(cart.length > 0)
        {
          setTimeout(() => {
            setCartNot(true)
          }, 1000);
        }
      },[cart])

       const [showNotification, setShowNotification] = useState(true);
       
       const handleShowCartNot = (value)=>{
        setShowNotification(value)
       }

  return (
    <Router>

      

{user && cart?.length > 0 && cartNot && showNotification &&(
  <CartNotification
  cartItems={cart?.length}
  totalValue={subtotal}
  onClose={() => setCartNot(false)}
  onOpenCartPopup={() => setIsCartPopupOpen(true)} // Open CartPopup when "View Cart" is clicked
  handleShowCartNot={()=>handleShowCartNot(false)}
/>
)}
      <CartPopup 
        isOpen={isCartPopupOpen} 
        onClose={() => {setIsCartPopupOpen(false); handleShowCartNot(true)}} 
        fetchCart={fetchCart} 
        cart={cart} 
      />
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
                <Navbar fetchCart={fetchCart} cart={cart} handleShowCartNot={handleShowCartNot}/>
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
          <Route path="/tnc" 
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart} handleShowCartNot={handleShowCartNot}/>
                <Tnc/>
                <Footer />
              </>
            }
           />
          <Route path="/privacypolicy" 
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart} handleShowCartNot={handleShowCartNot}/>
                <PrivacyPolicy />
                <Footer />
              </>
            }
           />
          <Route path="/refundpolicy" 
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart} handleShowCartNot={handleShowCartNot}/>
                <RefundPolicy/>
                <Footer />
              </>
            }
           />
          <Route path="/contactus" 
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart} handleShowCartNot={handleShowCartNot}/>
                <ContactUsFooter/>
                <Footer />
              </>
            }
           />
          <Route
            path="/product/:id"
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart} handleShowCartNot={handleShowCartNot}/>
                <MainProductPage fetchCart={fetchCart} cart={cart} />
                <Footer />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart} handleShowCartNot={handleShowCartNot}/>
                <Checkout fetchCart={fetchCart} cart={cart} />
                <Footer />
              </>
            }
          />
           <Route
            path="/about-us"
            element={
              <>
                <Navbar fetchCart={fetchCart} cart={cart} handleShowCartNot={handleShowCartNot}/>
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
              {user?.userType === "User" ? <Navbar fetchCart={fetchCart} cart={cart} handleShowCartNot={handleShowCartNot}/> : <AdminNavbar />}
                
                
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
                <Navbar fetchCart={fetchCart} cart={cart} handleShowCartNot={handleShowCartNot}/>
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
                <Navbar fetchCart={fetchCart} cart={cart} handleShowCartNot={handleShowCartNot}/>
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
                <Navbar fetchCart={fetchCart} cart={cart} handleShowCartNot={handleShowCartNot}/>
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
        {/* {showNotification && cart?.length > 0 && <CartNotification cartItems={cart} totalValue={subtotal} onClose={() => setShowNotification(false)} />} */}
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
