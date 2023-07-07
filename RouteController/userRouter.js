const {Router}=require("express");
const jwt = require('jsonwebtoken');

const { blogUserModel } = require("../models/blogUserModel");


const userRouter=Router();



userRouter.post('/signup',async (req,res)=>{
const {name,email,password}=req.body;
    try {
        const userDetail= blogUserModel({
            name,
            email,
            password
        })
        await userDetail.save();
        res.status(201).json({"message":"Signup successful"})
    } catch (error) {
        res.status(500).json({"mssg" :"error while Signup"})
        console.log("error while signup",error)
    }
})

userRouter.post('/login', async(req,res)=>{
    const {email,password}=req.body;
    const user= await  blogUserModel.findOne({email:email,password:password});
    try {
        const token = jwt.sign({userID: user._id }, process.env.SECRET);

        if(token){
            
            res.status(200).json({"mssg":"successfully login",token})
        } else{
            res.status(403).json({"mssg":"failed to login"})
        }
       
        console.log(user)
    } catch (error) {
        res.status(404).json({"mssg":"user not found"})
        console.log(error)
    }
})

userRouter.post('/logout',async(req,res)=>{
try {
    res.status(200).json({"mssg":"successfully login",token:''})
} catch (error) {
    res.status(500).json({"mssg":"error"})
}
})


module.exports={userRouter}