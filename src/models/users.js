const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://diegodimitroffpetcoff:Astronomico@diegodimitroffpetcoff.3tzttxc.mongodb.net/?retryWrites=true&w=majority/prueba",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

const Schema = new mongoose.Schema({
    username:{type: String, required: false, unique: true},
    password:{type: String, required: false}
})

module.exports = mongoose.model("userCollection", Schema)