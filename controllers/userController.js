const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

//@desc Register a new user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("Please provide all the fields.");
    }
    const userAvailable= await User.findOne({ email });
    if(userAvailable){
        res.status(400);
        throw new Error("User already exists.");
    }

    //Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user=await User.create({ username, email, password : hashedPassword });
    // console.log(`User created ${user}`);
    if(user){
        res.status(201).json({_id: user.id, email: user.email});
    }else{
        res.status(400);
        throw new Error("User data is invalid");
    }
    res.json({ message: "Registered the user." });
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!!");
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password , user.password))){
        const accessToken= jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id: user.id
            },
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn:"60m"}
        );
        res.status(200).json({accessToken});
    }else{
        res.status(401);
        throw new Error("Either email or password is invalid!!");
    }
});

//@desc Get current user info
//@route GET /api/users/current
//@access private
const currentUserInfo = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = { registerUser , loginUser , currentUserInfo};