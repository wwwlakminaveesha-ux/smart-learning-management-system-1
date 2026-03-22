import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({

title:{
type:String,
required:true
},

description:{
type:String,
required:true
},

fileUrl:{
type:String,
default:""
},

module:{
type:mongoose.Schema.Types.ObjectId,
ref:"Module",
required:true
},

deadline:{
type:Date,
required:true
},

totalMarks:{
type:Number,
default:100
},

type:{
type:String,
enum:["submission","quiz"],
default:"submission"
},

createdBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
}

},
{
timestamps:true
}
);

export default mongoose.model("Assignment",assignmentSchema);