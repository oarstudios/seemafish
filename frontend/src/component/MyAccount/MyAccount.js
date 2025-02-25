import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "./MyAccount.css";
import cake from "../../assets/fishimage.png";
import homeIcon from "../../assets/home (1).png"; 
import AddressEditModal from "../Checkout/AddressEditModal"; 
import {useLogout} from '../../hooks/useLogout'
import AddNewAddressModal from "../Checkout/AddNewAddressModal"; 
import useNotify from "../../hooks/useNotify";
import { useAuthContext } from "../../hooks/useAuthContext";
import officeActiveIcon from "../../assets/location (1).png";



const MyAccount = () => {
  const [edit1, setEdit1] = useState(false);
  // const [selectedDeliveryDate, setSelectedDeliveryDate] = useState("");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const {logout} = useLogout();
  const {notify} = useNotify()
  const navigate = useNavigate();
  const [newPass, setNewPass] = useState('');
  const {user} = useAuthContext();

  const [currentAddress, setCurrentAddress] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const [pincodes, setPincodes] = useState([])

  const fetchPincodes = async () => {
    try {
        const response = await fetch(`http://localhost:4001/pincodes`);
        const json = await response.json();

        if (response.ok) {
          // const prdTags = json.filter(prd => prd?.produtTag === product?.productTag); 
          console.log(json);
            setPincodes(json)
            console.log(json)
            // setCart(json)
        } else {
            console.error("Failed to fetch products:", json);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

    useEffect(()=>{
      console.log(user)
      setUsername(user?.username)
      setEmail(user?.email)
      setPassword(user?.password)
      setAge(user?.age)
      setGender(user?.gender)
      setAddresses(user?.addresses)
      console.log(user?.addresses)
      fetchPincodes();
    },[user, user?.addresses])



    useEffect(()=>{

      if(!newPass === "")
      {
        setPassword(newPass)
      }
    },[newPass])

    const [error, setError] = useState(false);

    const validatePassword = (password) => {
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
      if (!strongPasswordRegex.test(password)) {
        setError(true)
        
      } else {
        setError(false);
      }
      setPassword(password);
      setNewPass(password);
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
    
    const handleDateChange = (e) => {
      const selectedDate = e.target.value;
      setDob(selectedDate);
      setAge(calculateAge(selectedDate));
    };
    
    

    const [dob, setDob] = useState('')


    useEffect(()=>{
      setDob(calculateAge(age))
      console.log(age)
    },[age])
    
    
    

    const handleSubmit = async(e)=>{
      e.preventDefault();

      if(age <= 0)
      {
        setEdit1(!edit1)
        return notify("Enter valid age", "error")
      }

      if(error){
        console.log(password)
        setEdit1(!edit1)
        return notify(
          "Password must be at least 8 characters, with uppercase, lowercase, number, and special character.", "error"
        );

      }

      try{
        const formData = {
          username,
          email,
          password,
          age: dob,
          gender
        }

        const response = await fetch(`http://localhost:4001/users/${user?._id}`,{
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })

        const json = await response.json();

        if(response.ok)
        {
          console.log(json)
          // localStorage.setItem('user', JSON.stringify(json));
          localStorage.setItem('user', JSON.stringify({user: json, token: user?.token}));
          // dispatch({ type: 'LOGIN', payload: json });
          notify("Data updated successfully", "success")
        }
      }catch(error){
        console.log(error)
        notify("Error updating data", "error")
      }
    }
  
    

  const handleLogout = ()=>{
    try{
      logout();
      notify("Successfully logged out.", "success")
      console.log("Successfully logged out.")
      setTimeout(() => {
        navigate('/')
      }, 1000);
    }catch(error){
      console.log(error)
      notify(error, "error")
    }
  }

  const handleEditClick = (index) => {
    setCurrentAddress({ ...addresses[index] });
    setIsEditing(true);
  };

  const handleSaveAddress = (updatedAddress) => {
    setAddresses(addresses.map((addr) =>
      addr.id === updatedAddress.id ? updatedAddress : addr
    ));
    setIsEditing(false);
  };


  const handleAddNewAddress = (newAddress) => {
    setAddresses([...addresses, { id: addresses.length, ...newAddress }]);
    setIsAdding(false);
  };

  const usedAddressTypes = addresses?.map((addr) => addr.tag);
  const availableTypes = ["home1", "home2", "office"].filter(type => !usedAddressTypes?.includes(type));
  const disableAddButton = availableTypes.length === 0;


  const [addressId, setAddressId] = useState('')

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
  };

  const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:4001/orders/`);
      const json = await response.json();
  
      // Log the response to check its structure
      console.log("billings",json);
  
      if (Array.isArray(json.data)) {
        const filterOrders = json.data.filter(
          (or) => or?.userId?._id && or.userId._id === user?._id
        );
  
        // Sort the orders based on billingTime in descending order
        const sortedOrders = filterOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        setOrders(sortedOrders);
        console.log("order", sortedOrders);
      } else {
        console.log("Returned data is not an array:", json);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  

  useEffect(() => {
    if (user) {
      fetchOrders();
      console.log("ord", user?.password === "")
    }
  }, [user]);

  return (
    <div className="my-account-page">
      <div className="account-left">
        <div className="heading-row">
          <h2 className="heading">My Account</h2>
          {!edit1 && <button className="edit-button" onClick={() => setEdit1(true)}>Edit</button>}
        </div>
        <form className="account-form" onSubmit={(e)=>handleSubmit(e)}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={username} onChange={(e) => setUsername(e.target.value)} readOnly={!edit1} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly />
            </div>
            {user?.password?.length > 0 && (
 <div className="form-group">
 <label htmlFor="password">Set new password</label>
 <input type="password" id="password" placeholder="********" value={newPass} onChange={(e) => validatePassword(e.target.value)} readOnly={!edit1} />
</div>
            )}
           
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              {!edit1 ? <input type="text" value={age} readOnly/> : <input type="date" id="age" value={dob} onChange={handleDateChange} readOnly={!edit1} />}
              
              
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} disabled={!edit1}>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Other">Other</option>
</select>

            </div>
          </div>
          <div className="sbBtn">
            <button className="submit" type="submit" style={{ display: edit1 ? "block" : "none" }} onClick={() => setEdit1(false)}>Submit</button>
          </div>
        </form>

     {user?.userType != "Admin" && 
     <div className="address-section">
     <h2>Your Saved Addresses</h2>
     {addresses?.map((addr, index) => (
       <div
         key={addr.id}
         className={`address-box ${selectedAddress === index ? "selected" : ""}`}
         onClick={() => setSelectedAddress(index)}
       >
         <div className="address-content">
           <p className="name">{addr.firstName} {addr.lastName} <span className="phone">+91 {addr.phoneNo}</span></p>
           <p className="address">{addr.address}, {addr.landmark}, {addr.city}, {addr.state} - {addr.pincode}</p>
         </div>
         <div className="address-actions">
           <button className="home-button-checkout">
                               <img src={addr?.tag === "office" ? officeActiveIcon: homeIcon} alt="Home Icon" className="home-icon" />{addr?.tag?.toUpperCase()}
             
           </button>
           <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEditClick(index); setAddressId(addr?._id) }}>EDIT</button>
         </div>
       </div>
     ))}
     <div className="buttons">
       <button className="add-address" onClick={() => setIsAdding(true)} disabled={disableAddButton}>
         Add New Address
       </button>
      
     </div>
   </div>}
        
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {user?.userType != "Admin" && <div className="account-right">
        <h2 className="heading">Orders</h2>
        {orders?.map((ord, index)=>(
          <Link to={`/order/${ord?._id}`} className="orders-link" key={index}>
          <div className="orders-item">
            <img src={`http://localhost:4001/uploads/${ord?.products?.[0]?.product?.images?.[0]}`} alt="Order" className="orders-image" />
            <div className="orders-details">
            <p className="orders-date">{formatDate(ord?.createdAt)}</p>
              <p className={`orders-status ${ord?.status?.toLowerCase()}`}>{ord?.status}</p>
              {ord?.products?.map((prd, index)=>(
              <span className="orders-items" key={index}>{prd?.product?.name} x{prd?.quantity}</span>
              ))}
                
            </div>
          </div>
        </Link>
        ))}

        {orders?.length === 0 && 
          <p>No orders found.</p>
        }
        
      </div>}
      
      {isEditing && <AddressEditModal address={currentAddress} onClose={() => setIsEditing(false)} onSave={handleSaveAddress} addressId={addressId}/>}
      {isAdding && <AddNewAddressModal onClose={() => setIsAdding(false)} onSave={handleAddNewAddress} availableTypes={availableTypes} />}
    </div>
  );
};

export default MyAccount;
