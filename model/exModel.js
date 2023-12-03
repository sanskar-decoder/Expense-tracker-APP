const { default: mongoose } = require("mongoose");
const plm=require('passport-local-mongoose');
const data=new mongoose.Schema({
    name:String,
    username:String,
    password:String,
    email:String,
    no:String,
    age:String,
    profession:String,
  
    date:String,
    avatar:String,
    resetPasswordOtp: {
        type: Number,
        default: -1,
    },
expense:[
    { type: mongoose.Schema.Types.ObjectId,ref:"expense"}
],



},{timestamps:true});

data.plugin(plm)

module.exports=mongoose.model('user',data);