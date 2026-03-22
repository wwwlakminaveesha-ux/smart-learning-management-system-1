import mongoose from "mongoose";

const lectureMaterialSchema = new mongoose.Schema(
{
title:{
type:String,
required:true
},

description:{
type:String,
default:""
},

fileUrl:{
type:String,
required:true
},

module:{
type:mongoose.Schema.Types.ObjectId,
ref:"Module",
required:true
},

uploadedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
}

},
{
timestamps:true
}
);

export default mongoose.model("LectureMaterial",lectureMaterialSchema);