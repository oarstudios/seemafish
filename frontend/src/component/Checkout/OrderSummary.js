import { useEffect, useRef, useState } from "react";
import "./OrderSummary.css";
import { useNavigate } from "react-router-dom";
import PaymentMethod from "./PaymentMethod";
import DeliveryTimeModal from "./DeliveryTimeModal"; 
import clockIcon from "../../assets/time.png"; 
import homeIcon from "../../assets/home (1).png";
import { useAuthContext } from "../../hooks/useAuthContext";
import useNotify from "../../hooks/useNotify";

const OrderSummary = ({ address, orderItems, onBack, setCurrentStep, fetchCart }) => {
 
  const navigate = useNavigate();
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(""); 
  const [selectedPayment, setSelectedPayment] = useState("paynow"); 
  const {user} = useAuthContext();
  console.log(user)
  const {notify} = useNotify();

  const [pincode, setPincode] = useState([])
    
      const fetchPincodes = async () => {
        try {
            const response = await fetch(`http://localhost:4001/pincodes`);
            const json = await response.json();
    
            if (response.ok) {
              console.log(json);
               // Check if pincode exists in the fetched pincodes list
            const pc = await json?.filter(item => JSON.stringify(item?.pincode) === address?.pincode)
                setPincode(pc)
                console.log(pc)
                // setCart(json)
            } else {
                console.error("Failed to fetch products:", json);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(()=>{
      fetchPincodes();
    },[user])

  const proceedButtonRef = useRef(null);
  const lastScrollTop = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;

      if (currentScrollTop > lastScrollTop.current) {
        // Scrolling Down
        setCurrentStep(3); // Move to Payment
      } else {
        // Scrolling Up
        setCurrentStep(2); // Move back to Order Summary
      }

      lastScrollTop.current = currentScrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setCurrentStep]);




  const subtotal = orderItems?.reduce(
    (acc, item) => acc + item?.productId?.price?.sale * item?.quantity,
    0
  );

  const total = subtotal + pincode?.[0]?.deliveryCharges;

  console.log(total)

  const lastSpaceIndex = selectedSlot.lastIndexOf(" ");
const day = selectedSlot.substring(0, lastSpaceIndex); // "Tomorrow 21 Feb"
const slot = selectedSlot.substring(lastSpaceIndex + 1); 

useEffect(()=>{
  console.log(day, slot)
},[day, slot])

  const [randomString, setRandomString] = useState("");
  
  const generateRandomString = (length = 6) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let result = "#";  // Start with '#'
    
    // Add two numbers at random positions
    let numCount = 0;
    while (numCount < 2) {
      const randomChar = numbers.charAt(Math.floor(Math.random() * numbers.length));
      if (!result.includes(randomChar)) {  // Ensure the number is not repeated
        result += randomChar;
        numCount++;
      }
    }
  
    // Add random letters until the string reaches the desired length
    while (result.length < length) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    // Ensure the result has exactly the desired length
    setRandomString(result.slice(0, length));
  };
  
  
      useEffect(()=>{
        generateRandomString();
        console.log(user?.cart)
      },[user])

      const showError = ()=>{
        notify('Login in to add to basket', "error")
      }

      const updatedUserCart = async () => {
        if (!user) return showError();
        try {
          const response = await fetch(`http://localhost:4001/users/${user?._id}`, {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
      
          const updatedUser = await response.json();
          console.log('updated user', updatedUser)
          if (response.ok) {
            // setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify({token: user.token, user: updatedUser}));
            
            fetchCart();
            console.log("updt", user)
          }
        } catch (error) {
          console.error('Failed to update user cart:', error);
        }
      };

  const handleBillSubmit = async () => {

    
    

    try {
      const formData = {
        billId: randomString,
        email: user?.email,
        products: orderItems.map(item => ({
            product: item?.productId?._id,  // Extract product ID
            quantity: item?.quantity,
            price: item?.productId?.price?.sale // Use sale price if available
        })),
        shippingAddress: address,
        status: "Pending",
        time: {
            day,
            slot
        },
        billPrice: total
    };
    

      console.log(formData)
  
      // If the billing address is the same as the shipping address, copy the shipping address to billing address
      // if (!differentBillingAddress) {
      //   formData.billingAddress = { ...formData.shippingAddress }; // Ensure billing address is the same as shipping
      // }
  
      const response = await fetch(`http://localhost:4001/orders/${user?._id}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      const json = await response.json();
  
      if (response.ok) {
        console.log("order",json);
        notify('Order successfully placed', "success");
        setTimeout(() => {
          navigate(`/order/${json?.data?._id}`);
        }, 1000);
      }
  
      console.log("formData", formData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmptyCart = async () => {
    if (!user) {
      return showError();
    }
  
    try {
      const response = await fetch(`http://localhost:4001/users/${user?._id}/cart`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const json = await response.json();
      if (response.ok) {
        console.log("Cart emptied successfully:", json);
        updatedUserCart(); // Refresh cart after emptying
        // notify("Cart emptied successfully", "success");
      }
    } catch (error) {
      console.log("Error emptying cart:", error);
      notify("Error emptying cart", "error");
    }
  };
  
  
  const [pay, setPay] = useState();
  


   //PAYMENT GATEWAY

   const paymentHandler = async(e) =>{
    e.preventDefault();

    if (!selectedSlot) {
      notify("Please select a time slot before proceeding with the payment.", "error");
      return;
    }

    const productDataArray = user?.cart?.map(item => ({
      product: item?.productId?._id,
      quantity: item.quantity // Include the quantity for each product
    }));

      if (productDataArray?.length === 0) {
        // notify('No product data to submit.',"info");
        console.log("No product data to submit.")

        return;
      }
    const data = {
      productIds: productDataArray, // Changed from productIds to productData
      firstName: address?.firstName,
      lastName:  address?.lastName,
      country: 'INDIA',
      address:  address,
      city:  address?.city,
      state:  address?.state,
      pincode:  address?.pincode,
      phoneNumber:  address?.phoneNo,
      email:  user?.email,
      totalPrice: total,
      status: 'Order Placed'
    };


    if(!data?.firstName || !data?.lastName || !data?.country || !data?.address || !data?.city || !data?.state || !data?.pincode || !data?.phoneNumber || !data?.email || !data?.status)
      {
        return setPay(false)
      }
    const amount= total * 100;
    const currency= "INR";
    const receipt = "abcdef"
    const response = await fetch('http://localhost:4001/order',{
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        receipt
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const order = await response.json();
    console.log('payment', order)

    var options = {
      "key": "rzp_test_q34DaePkfJ8UeT", // Enter the Key ID generated from the Dashboard
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency,
      "name": "Acme Corp", //your business name
      "description": "Test Transaction",
      "image": "https://example.com/your_logo",
      "order_id": order.order?.id, 
      "handler": async function(response){
        const body = {
          ...response, 
        }

        const validateRes = await fetch('http://localhost:4001/order/validate',{
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        
    
        // Prepare the data object for the request
        

        const json = await validateRes.json()
        if(validateRes.ok)
        {
          try{
            await handleBillSubmit();
            await handleEmptyCart();
            
          }catch(error)
          {
            console.log('Error:', error);
          }
        }
        console.log(json)
      },
      "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
          "name": "Gaurav Kumar", //your customer's name
          "email": "gaurav.kumar@example.com",
          "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
      },
      "notes": {
          "address": "Razorpay Corporate Office"
      },
      "theme": {
          "color": "#3399cc"
      }
  };
  var rzp1 = new window.Razorpay(options);
      rzp1.open();
      // e.preventDefault();
  
  }

  

  return (
    <div className="order-summary-container">
      <h2>Order Summary</h2>
      <button className="delivery-time-btn" onClick={() => setShowDeliveryPopup(true)}>
  {selectedSlot === "" ? (
    "Select Slot"
  ) : (
    <>
      <img src={clockIcon} alt="Clock Icon" className="clock-icon" /> 
      {selectedSlot} <span>▼</span>
    </>
  )}
</button>


      <p className="deliver-to-text">Deliver to:</p>
      <div className="address-box">
        <div className="address-content">
          <p className="name">{address?.firstName} {address?.lastName} <span className="phone">{address?.phoneNo}</span></p>
          <p className="address">{address?.address}, {address?.landmark}, {address?.city}, {address?.state} - {address?.pincode}</p>
        </div>
        <div className="address-actions">
          <button className="home-button-checkout">
            <img src={homeIcon} alt="Home Icon" className="home-icon" /> {address?.tag?.toUpperCase()}
          </button>
        </div>
      </div>

      <div className="user-order-details">
        <h3 className="deliver-to-text">Order Details:</h3>
        {orderItems?.map((product, index) => (
          <div key={index} className="user-order-item">
            {console.log(orderItems)}
            <img src={`http://localhost:4001/uploads/${product?.productId?.images?.[0]}`} alt="Product" className="user-order-img" />
            <div className="user-order-info">
              <p className="user-product-name">{product?.productId?.name}</p>
              <p className="user-product-weight">{product?.productId?.weight}</p>
              <div className="user-price-quantity">
                <p className="user-product-price">₹{product?.productId?.price?.sale}</p>
                <p className="user-product-quantity">Quantity x{product?.quantity}</p>
              </div>
            </div>
            <p className="user-final-price">Final Price: <span className="user-final-price-span">₹{product?.productId?.price?.sale * product.quantity}</span></p>
          </div>
        ))}
      </div>

      <div className="user-price-summary">
        <p className="user-price-text">Delivery:</p>
        <p className="user-price-value">₹{pincode?.[0]?.deliveryCharges}</p>
        <p className="user-price-text">Taxes:</p>
        <p className="user-price-value">₹0</p>
        <h3 className="user-price-total">Total:</h3>
        <h3 className="user-price-total-value">₹{orderItems.reduce((total, product) => total + product?.productId?.price?.sale * product?.quantity, pincode?.[0]?.deliveryCharges)}</h3>
      </div>

      <PaymentMethod selectedPayment={selectedPayment} setSelectedPayment={setSelectedPayment} />

      <button ref={proceedButtonRef} className="select-address" onClick={(e)=>paymentHandler(e)}>
        Proceed to Payment
      </button>

      {showDeliveryPopup && <DeliveryTimeModal onClose={() => setShowDeliveryPopup(false)} onSelectSlot={setSelectedSlot} />}
    </div>
  );
};

export default OrderSummary;
