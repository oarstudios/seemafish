require('dotenv').config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const reviewsRoutes = require('./routes/reviewsRoutes')
const ftdRoutes = require('./routes/ftdRoutes')
const pincodeRoutes = require('./routes/pincodeRoutes')
const catRoutes = require('./routes/categoryRoutes')
const productTagRoutes = require('./routes/productTagRoutes')
const creativeRoutes = require('./routes/creativeRoutes')
const { OAuth2Client } = require('google-auth-library');
const User = require('./models/UserModel');
const Razorpay = require('razorpay')
const crypto = require('crypto')

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
const corsOptions = {
  origin: ['http://localhost:3000', 'https://freshimeat.in', 'https://www.freshimeat.in'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use("/users", userRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/reviews', reviewsRoutes)
app.use('/ftds', ftdRoutes)
app.use('/pincodes', pincodeRoutes)
app.use('/categories', catRoutes)
app.use('/productTags', productTagRoutes)
app.use('/creatives', creativeRoutes)


app.use((err, req, res, next)=>{
    //console.log(err.stack)
    res.status(500).json({error: "Something went wrong!!"})
})

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    () => console.log("Connected to MongoDB")
  )
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
  

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
  });

  app.listen(PORT, '0.0.0.0', () => {
    //console.log(`Server running on port ${PORT}`);
});


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generateUserId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let userId = "";
  for (let i = 0; i < 6; i++) {
    userId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return userId;
};
app.post('/users/google-login', async (req, res) => {
    try {
      const { token } = req.body;
  
      // Verify the Google token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '328812640603-179dlp268a73oihjvct4f5cpnjlulns4.apps.googleusercontent.com', // Replace with your actual client ID
      });
  
      const payload = ticket.getPayload();
  
      // Check if the user already exists in the database
      let user = await User.findOne({ email: payload.email });
      
      if (!user) {
        // If the user doesn't exist, create a new user
        user = await User.create({
          email: payload.email,
          username: payload.given_name, // First name from Google payload
          userType: 'User', // Default user type
          userId: generateUserId()
        });
      }
  
      // Optionally, generate a JWT token for your application
      const jwtToken = generateJwtToken(user);
      // Send response with user data and token
      res.status(200).json({
        message: 'Google login successful',
        user: user,
        token: jwtToken,
      });
    } catch (err) {
      console.error('Error during Google login:', err.message);
      res.status(401).json({ error: 'Invalid Google token' });
    }
  });

  // Helper function to generate a JWT token (example)
  const generateJwtToken = (user) => {
    const jwt = require('jsonwebtoken');
    const secretKey = process.env.SECRET; // Replace with your actual secret key
    return jwt.sign(
      {
        id: user._id
      },
      secretKey,
      { expiresIn: '1h' } // Token validity
    );
  };

  
  app.post('/order', async (req, res) => {
    try {
      const { amount, currency, receipt } = req.body;
  
      //console.log("Received order request:", req.body); // ✅ Log incoming
  
      if (!amount || !currency || !receipt) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      });
  
      const options = {
        amount: Number(amount),
        currency,
        receipt,
      };
  
      const order = await razorpay.orders.create(options);
      //console.log("Created Razorpay order:", order); // ✅ Log order object
  
      if (!order) {
        return res.status(500).json({ error: 'Failed to create order' });
      }
  
      res.status(200).json({ order });
    } catch (error) {
      console.error("Error in /order:", error); // ✅ Better error visibility
      res.status(500).json({ error: 'Failed to process order' });
    }
  });
  
  
  
  app.post('/order/validate', async (req, res) =>{
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
  
    const sha = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
  
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const digest = sha.digest("hex");
    if(digest !== razorpay_signature)
    {
      return res.status(400).json({error: 'Invalid signature'});
    }
    res.status(200).json({message: 'Signature verified', orderId: razorpay_order_id, paymentId: razorpay_payment_id});
  })
