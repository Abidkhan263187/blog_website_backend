const {Router}=require("express");
const { blogModel } = require("../models/blogmodel");


const blogUserRouter=Router();


blogUserRouter.post('/create',async(req,res)=>{
    const {title,type,content}=req.body
    try {
        const blog= await blogModel({
            title,
            type,
            content
        })
        await blog.save();
        console.log("yes")
        res.status(200).json({mssg:"blog sreated successfully", blog})
        
    } catch (error) {
        res.status(404).send({mssg:"error creating blog", error})
    }
  })

  module.exports={blogUserRouter}