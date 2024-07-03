const mongoose = require("mongoose")


const schema = new mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type:String
    }
})

const userModel =  mongoose.model("User" , schema);
console.log(userModel , "kjlsdf")
module.exports  = {userModel};