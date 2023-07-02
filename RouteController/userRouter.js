const {Router}=require("express");
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

    try {
        const verify= await  blogUserModel.findOne({email:email})
        res.status(200).json({"mssg":"successfully login",verify})
        console.log(verify)
    } catch (error) {
        res.status(404).json({"mssg":"user not found"})
        console.log(error)
    }
})


module.exports={userRouter}