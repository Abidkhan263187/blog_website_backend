const mongoose = require("mongoose")


const blogSchema = new mongoose.Schema({
   title:{type:String, required:true},
   type:{type:String, required:true},
   content:{type:String, required:true},
}
, { timestamps: true })


const blogModel = mongoose.model('blog', blogSchema)

module.exports = { blogModel }