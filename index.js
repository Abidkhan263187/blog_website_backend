const express = require('express');
require("dotenv").config()
const cors=require("cors");
const {connection, connection2} =require('./config/db');
const { blogModel } = require('./models/blogmodel');
const { blogUserRouter } = require('./RouteController/blogUser');
const { userRouter } = require('./RouteController/userRouter');
const { tourismRouter } = require('./RouteController/tourism');



const app = express();
app.use(express.json())


app.use(cors({
    origin: '*'
  })) 


app.get('/', (req, res) => {
    res.status(200).json({mssg:"welcome"})
})

  app.use('/blog',blogUserRouter)

  app.use('/user',userRouter)

  app.use('/tourism',tourismRouter)

  

app.listen(process.env.PORT, async()=>{
    try {
        await connection;
        console.log("connection established")
    } catch (error) {
        console.log("connection error",error)
    }
    console.log("server listening on port", process.env.PORT)
})