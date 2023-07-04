const express = require('express');
require("dotenv").config()
const cors=require("cors");
const {connection} =require('./config/db');
const { blogModel } = require('./models/blogmodel');
const { blogUserRouter } = require('./RouteController/blogUser');
const { userRouter } = require('./RouteController/userRouter');

const app = express();
app.use(express.json())


app.use(cors({
    origin: '*'
  })) 
app.get('/', (req, res) => {
    res.status(200).json({"mssg":"complete"})
})
  app.use('/blog',blogUserRouter)

  app.use('/user',userRouter)

app.listen(process.env.PORT, async()=>{
    try {
        await connection;
        console.log("connection established")
    } catch (error) {
        console.log("connection error",error)
    }
    console.log("server listening on port", process.env.PORT)
})