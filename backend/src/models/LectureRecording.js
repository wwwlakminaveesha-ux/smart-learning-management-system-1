import mongoose from "mongoose";

const lectureRecordingSchema = new mongoose.Schema(
{
title:{
type:String,
required:true
},

videoUrl:{
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

export default mongoose.model("LectureRecording",lectureRecordingSchema);