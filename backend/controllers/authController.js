const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//Generate JWT TOKEN
const generateToken = (userId)=>{
    return  jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "7d"})
}

//@desc Register new user
//@route POST /api/auth/register
//@access Public
const registerUser = async (req,res)=>{
    try {
        const {name, email, password, profileImageURL} = req.body
        console.log("HERE IN BACKEND ",profileImageURL);
        
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({message:"User Already Exists"})
        }

        //Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //Create New User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageURL,
        })
        
        //Return User with jwt
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageURL: user.profileImageURL,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}

//@desc Login user
//@route POST /api/auth/login
//@access Public
const loginUser = async (req,res)=>{
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user){
            return res.status(500).json({message:"Invalid Email Or Password"})
        }

        //Compare Password
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(500).json({message:"Invalid Email Or Password"})
        }

        //Return user with JWT data
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageURL,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}

//@desc Get user Profile
//@route GET /api/auth/profile
//@access Private
const getUserProfile = async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password")
        if(!user){
            return res.status(404).json({message:"User Not Found"})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message})
    }
}

module.exports = {registerUser, loginUser, getUserProfile}