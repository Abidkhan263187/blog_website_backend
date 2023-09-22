const jwt = require('jsonwebtoken');
const {Router}=require('express');
const { tourismUsers } = require('../models/tourismModel');



const tourismReg= Router();
tourismReg.get('/signup',(req,res)=>{
    res.send("welcome folsk")
})

tourismReg.post('/signup', async(req,res)=>{
const { firstName,
    lastName,
    email,
    mobileNo,
    password,
    confirmPassword}=req.body

try {
     let tourismUser= tourismUsers({
        firstName,
        lastName,
        email,
        mobileNo,
        password,
        confirmPassword
     })
     await tourismUser.save()
     res.status(200).json({mssg:"signup success",user:tourismUser})
      
} catch (error) {
    console.log(error,"error while ssignup")
    res.status(404).json({mssg:"error while signing up"})
}

})

tourismReg.post('/login',async( req,res)=>{
    const {email,password}  = req.body
    try {
        const user=    await tourismUsers.findOne({email: email, password: password})
        if(user){
            const token = jwt.sign({email:email}, process.env.SECRET);
            res.status(200).json({status:"success",token: token})
        }else{
            res.status(500).json({status:"wrong",error: "Credentials not found"})
        }
        
    } catch (error) {
        res.status(500).json({error: "error while login"})
    }
})

module.exports={tourismReg}