import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["admin","lecturer","student"],
        default:"student"
    },

    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department",
        default:null
    },

    isActive:{
        type:Boolean,
        default:true
    },

    lastLogin:{
        type:Date
    }

},{
    timestamps:true
});

export default mongoose.model("User",userSchema);