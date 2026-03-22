import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({

assignment:{
type:mongoose.Schema.Types.ObjectId,
ref:"Assignment",
required:true
},

student:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

fileUrl:{
type:String,
required:true
},

submittedAt:{
type:Date,
default:Date.now
},

marks:{
type:Number,
default:null
},

feedback:{
type:String,
default:""
},

status:{
type:String,
enum:["submitted","graded"],
default:"submitted"
}

},
{
timestamps:true
}
);

export default mongoose.model("Submission",submissionSchema);