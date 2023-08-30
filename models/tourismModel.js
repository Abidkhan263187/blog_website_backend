const mongoose = require('mongoose');

const tourSchema=new mongoose.Schema({
    name:{type:String},
    place:{type:String},
    img:{type:String},
})
const tourModel=mongoose.model('tourism',tourSchema)

module.exports={tourModel}