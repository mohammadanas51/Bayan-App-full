const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true,
        trim : true 
    },
    password : {
        type : String , 
        required : true,
    },
});


// Creating a model named User for the userSchema
// The model User will be converted into users by MongoDB
const User = mongoose.model("User",userSchema);
module.exports = User ; 