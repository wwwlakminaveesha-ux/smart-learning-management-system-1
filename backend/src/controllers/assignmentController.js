import Assignment from "../models/Assignment.js";

export const createAssignment = async(req,res)=>{

try{

const {
title,
description,
fileUrl,
module,
deadline,
totalMarks
}
= req.body;

const assignment = await Assignment.create({

title,
description,
fileUrl,
module,
deadline,
totalMarks,

createdBy:req.user._id

});

res.status(201).json(assignment);

}
catch(error){

res.status(500).json({

message:error.message

});

}

};



export const getModuleAssignments = async(req,res)=>{

try{

const assignments = await Assignment.find({

module:req.params.moduleId

})
.populate("createdBy","name email")
.sort({createdAt:-1});

res.json(assignments);

}
catch(error){

res.status(500).json({

message:error.message

});

}

};