const { default: mongoose } = require("mongoose");

const dat= new mongoose.Schema({
    amount:Number,
    categories:
    {
        type:String,
        enum:['food','medical','travel','utility']
    },
    paymentmode:
   {
    type:String,
    enum:['cash','online','check']
    },

    user: { type:mongoose.Schema.Types.ObjectId,ref:"user"},

//enum is used to provide a limited option
},{timestamp:true});

module.exports=mongoose.model('expense',dat)