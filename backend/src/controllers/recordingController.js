import LectureRecording from "../models/LectureRecording.js";

export const addRecording = async(req,res)=>{

try{

const {title,videoUrl,module} = req.body;

const recording = await LectureRecording.create({

title,
videoUrl,
module,
uploadedBy:req.user._id

});

res.status(201).json(recording);

}
catch(error){

res.status(500).json({
message:error.message
});

}

};



export const getModuleRecordings = async(req,res)=>{

try{

const recordings = await LectureRecording.find({

module:req.params.moduleId

})
.populate("uploadedBy","name email")
.sort({createdAt:-1});

res.json(recordings);

}
catch(error){

res.status(500).json({
message:error.message
});

}

};