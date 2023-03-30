const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

const Schema = new mongoose.Schema({
    username:{type: String, required: false, unique: true},
    password:{type: String, required: false},
    email:{type: String, required: false, unique: true},
    firstName: {type: String, required: false, unique: true},
    secondName:{type: String, required: false, unique: true},
    cellphone: {type: String, required: false, unique: true},
})

module.exports = mongoose.model("userCollection", Schema)