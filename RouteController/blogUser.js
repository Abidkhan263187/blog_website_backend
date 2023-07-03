const {Router}=require("express");
const jwt = require('jsonwebtoken');
const { blogModel } = require("../models/blogmodel");


const blogUserRouter=Router();


// crud on blog 
 
const authenticate=(req,res,next)=>{
    const authorizationHeader = req.headers.authorization;
   
    if (!authorizationHeader) {
        return res.status(401).json({ msg: "Please login again" });
    }
         const token= req.headers.authorization.split(" ")[1];
         if(!token){
            res.status(401).json({ msg: "please loginagain "})
         }else{
            const decoded= jwt.verify(token, process.env.SECRET);
            if(decoded){
                const {userID}=decoded
                req.userID=userID
                next();
            }else{
                res.status(401).json({ msg: "Invalid token"})
            }
         }
}


blogUserRouter.get('/', authenticate,async(req,res )=>{
  
    try {
        const blogList= await blogModel.find({userID:req.userID})
        if(blogList.length<=0){
         return  res.status(404).send({mssg:"not found"})
        }
        if (blogList.length > 0) {
            res.status(200).json({ mssg: "Here are the matching blogs", blogList });
          } else {
            res.status(404).send({ mssg: "No blogs available for this query" });
          }
        } catch (error) {
          console.log("Error while getting the blogs list");
          console.log(error);
          res.status(500).send({ mssg: "Error while getting the list", error });
        }
  })

blogUserRouter.post('/create',authenticate,async(req,res)=>{
    const {title,type,content}=req.body
   
    try {
        const blog= await blogModel({
            title,
            type,
            content,
            userID:req.userID
        })
        await blog.save();
        console.log("yes")
        res.status(200).json({mssg:"blog sreated successfully", blog})
        
    } catch (error) {
        res.status(404).json({mssg:"error creating blog", error})
    }
  })


  blogUserRouter.delete('/delete/:id',authenticate, async(req, res)=> {
  const {id}=req.params
  const delBlog= await  blogModel.findOneAndDelete({userID:req.userID, _id:id})
  console.log(delBlog)
  try {
    if (delBlog) {
        res.status(200).send({ mssg: "successfully deleted" })
    }
    else {
        res.status(404).send({ mssg: "you are not authorized" })
    }
} catch (error) {
    console.log("error while deleting blog")
    console.log(error)
    res.status(500).send({ mssg: "error while deleting blog", error })
}

  })


  blogUserRouter.patch('/edit/:id', authenticate,async(req,res)=>{
    const {id}=req.params

    try {
        const updateBlog = await blogModel.findOneAndUpdate( { _id: id, userID: req.userID },req.body );
       
        if(updateBlog){
          res.status(200).send({ mssg: "successfully updated" });
        }else{
          res.status(404).send({ mssg: "you are not authorize" })
        }
      
      } catch (error) {
        console.log("error while updating blog");
        console.log(error);
        res.status(500).send({ mssg: "error while updating blog", error });
      }
  })
  module.exports={blogUserRouter}