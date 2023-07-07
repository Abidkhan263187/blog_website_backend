const { Router } = require("express");
const jwt = require('jsonwebtoken');
const { blogModel } = require("../models/blogmodel");


const blogUserRouter = Router();


// crud on blog 

const authenticate = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ msg: "Please login again" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).json({ msg: "please login again " })
  } else {
    const decoded = jwt.verify(token, process.env.SECRET);
    if (decoded) {
      const { userID } = decoded
      req.userID = userID
      next();
    } else {
      res.status(401).json({ msg: "Invalid token" })
    }
  }
}

blogUserRouter.get('/', async (req, res) => {
  const { sortBy, order, type, page, limit } = req.query

  const currPage = parseInt(page || 1);
  const currLimit = parseInt(limit || 3); // Set default limit to 3 if not provided
  const skip = (currPage - 1) * currLimit;
  try {
    const blogList = await blogModel.find().skip(skip).limit(currLimit) // Use currLimit instead of parseInt(limit)
    console.log(blogList)
    if (!blogList) { // Change the condition to check if it's less than 1
      return res.status(404).send({ mssg: "not found" ,blogList:[] })
    }
    res.status(200).json({ mssg: "Here are the blogs", blogList });
  } catch (error) {
    console.log("Error while getting the blogs list");
    console.log(error);
    res.status(500).send({ mssg: "Error while getting the list", error });
  }
});


blogUserRouter.get('/single/:id', async (req, res) => {
  const { id } = req.params
  try {
    const single = await blogModel.findOne({ _id: id })
    console.log(single)
    res.status(200).json({ mssg: " Yoyr blog", single })
  } catch (error) {
    console.log("Error while getting the blog ");
    console.log(error);
    res.status(500).send({ mssg: "Error while getting the  blog", error });
  }
})


blogUserRouter.get('/dashboard', authenticate, async (req, res) => {
  const { sortBy, order, type, page, limit } = req.query

  const currPage = parseInt(page || 1);
  const currLimit = parseInt(limit || 4);
  const skip = (currPage - 1) * currLimit;
  try {
    let blogList
    if (sortBy && order) {
      ordering = order === 'asc' ? 1 : -1
      blogList = await blogModel.find({ userID: req.userID }).sort({ [sortBy]: ordering }).skip(skip).limit(parseInt(currLimit))
    }
    else if (type || sortBy && order) {
      ordering = order === 'asc' ? 1 : -1
      blogList = await blogModel.find({ userID: req.userID, type: type }).sort({ [sortBy]: ordering }).skip(skip).limit(parseInt(currLimit))
    }
    else if (limit) {
      blogList = await blogModel.find({ userID: req.userID }).skip(skip).limit(parseInt(currLimit))
    }
    else {
      blogList = await blogModel.find({ userID: req.userID }).skip(skip).limit(parseInt(currLimit))
    }
    res.status(200).json({ mssg: "Here are the matching blogs", blogList })

  } catch (error) {
    console.log("Error while getting the blogs list");
    console.log(error);
    res.status(500).send({ mssg: "Error while getting the list", error });
  }
})


blogUserRouter.post('/create', authenticate, async (req, res) => {
  const { title, type, content } = req.body

  try {
    const blog = await blogModel({
      title,
      type,
      content,
      userID: req.userID
    })
    await blog.save();
    console.log("yes")
    res.status(200).json({ mssg: "blog sreated successfully", blog })

  } catch (error) {
    res.status(404).json({ mssg: "error creating blog", error })
  }
})


blogUserRouter.delete('/delete/:id', authenticate, async (req, res) => {
  const { id } = req.params
  const delBlog = await blogModel.findOneAndDelete({ userID: req.userID, _id: id })
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


blogUserRouter.patch('/edit/:id', authenticate, async (req, res) => {
  const { id } = req.params

  try {
    const updateBlog = await blogModel.findOneAndUpdate({ _id: id, userID: req.userID }, req.body);

    if (updateBlog) {
      res.status(200).send({ mssg: "successfully updated" });
    } else {
      res.status(404).send({ mssg: "you are not authorize" })
    }

  } catch (error) {
    console.log("error while updating blog");
    console.log(error);
    res.status(500).send({ mssg: "error while updating blog", error });
  }
})
module.exports = { blogUserRouter }