const mongoose = require('mongoose')



const blogUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})
const blogUserModel = mongoose.model('blogUser', blogUserSchema)

module.exports = { blogUserModel }