const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const UserModel = mongoose.Schema({
    userId: {
        type: String,
    },
    username: {
        type: String,  
        required: true
    },
    email: {
        type: String,  
        required: true
    },
    password:{
        type: String, 
    },
    phoneNo: {
        type: String
    },
    addresses: [
        {
            firstName: {
                type: String,
            },
            lastName: {
                type: String,
            },
            address: {
                type: String,
            },
            landmark:{
                type: String,
            },
            state: {
                type: String,
            },
            city: {
                type: String,
            },
            pincode: {
                type: String,
            },
            phoneNo: {
                type: String
            },
            tag: {
                type: String
            }
        }
    ],
    age:{
        type: String,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    cart: [
        {
            productId:{
                type: mongoose.Schema.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number
            },
            price: {
                type: Number
            }
        }
    ],
    userType: {
        type: String,
        enum: ["User", "Admin"],
        required: true
    }
}, {timestamps: true})

UserModel.statics.signup = async function(userId, username, email, password, userType)
{
    if(!userId || !username || !email || !password || !userType){
        throw Error("All fields must be filled")
    }

    if(!validator.isEmail(email))
    {
        throw Error("Enter valid email address")
    }

    if(!validator.isStrongPassword(password))
    {
        throw Error("Password is too weak")
    }

    const userExists = await this.findOne({email})
    if(userExists)
    {
        throw Error("Email already in use")
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({
        userId,
        username,
        email,
        password: hash, 
        userType
    })

    return user;
}

UserModel.statics.login = async function(email, password){
    if(!email || !password)
    {
        throw Error("All fields must be filled")
    }

    const user = await this.findOne({email})

    if(!user){
        throw Error("Enter valid email address")
    }

    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error("Enter valid password")
    }

    return user;
}

module.exports = mongoose.model("User", UserModel);