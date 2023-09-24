const mongoose = require('mongoose');

const tourSchema=new mongoose.Schema({
    name:{type:String},
    place:{type:String},
    img:{type:String},
})
const tourModel=mongoose.model('tourism',tourSchema)


const tourismUSerScehma= new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true},
    mobileNo:{type:String,required:true},
    password:{type:String,required:true},
    confirmPassword:{type:String,required:true},
    token:{type:String,default:''}
})

const tourismUsers= mongoose.model('tourismUser',tourismUSerScehma)

module.exports={tourModel,tourismUsers}