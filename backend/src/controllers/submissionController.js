import Submission from "../models/Submission.js";

export const submitAssignment = async(req,res)=>{

try{

const {assignment,fileUrl}
= req.body;

const submission =
await Submission.create({

assignment,
student:req.user._id,
fileUrl

});

res.status(201).json(submission);

}
catch(error){

res.status(500).json({

message:error.message

});

}

};



export const getAssignmentSubmissions =
async(req,res)=>{

try{

const submissions =
await Submission.find({

assignment:req.params.assignmentId

})
.populate("student","name email");

res.json(submissions);

}
catch(error){

res.status(500).json({

message:error.message

});

}

};



export const gradeSubmission =
async(req,res)=>{

try{

const submission =
await Submission.findById(req.params.id);

submission.marks =
req.body.marks;

submission.feedback =
req.body.feedback;

submission.status="graded";

await submission.save();

res.json({

message:"Submission graded"

});

}
catch(error){

res.status(500).json({

message:error.message

});

}

};

export const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            student: req.user._id
        })
        .populate({
            path: "assignment",
            select: "title module deadline totalMarks",
            populate: {
                path: "module",
                select: "name code"
            }
        })
        .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};