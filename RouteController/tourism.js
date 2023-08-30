const {Router}=require('express')
const {tourModel}= require('../models/tourismModel')


const tourismRouter=Router()


tourismRouter.get('/',async(req,res)=>{
 let data= await  tourModel.find()
console.log(data)
res.send({mssg:"hi from travel page",data:data})
})

module.exports={tourismRouter}