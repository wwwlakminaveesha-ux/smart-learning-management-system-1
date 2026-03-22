import Result from "../models/Result.js";
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Quiz from "../models/Quiz.js";
import Module from "../models/Module.js";

export const publishStudentModuleResult = async (req, res) => {
    try {
        const { moduleId, studentId, feedback } = req.body;

        const moduleData = await Module.findById(moduleId);

        if (!moduleData) {
            return res.status(404).json({
                message: "Module not found"
            });
        }

        const assignmentIds = await Assignment.find({
            module: moduleId,
            type: "submission"
        }).select("_id");

        const quizIds = await Quiz.find({
            module: moduleId
        }).select("_id");

        const submissions = await Submission.find({
            assignment: { $in: assignmentIds.map(a => a._id) },
            student: studentId,
            status: "graded"
        });

        const quizAttempts = await QuizAttempt.find({
            quiz: { $in: quizIds.map(q => q._id) },
            student: studentId
        });

        const assignmentMarks = submissions.reduce((sum, item) => sum + (item.marks || 0), 0);
        const quizMarks = quizAttempts.reduce((sum, item) => sum + (item.totalScore || 0), 0);
        const totalMarks = assignmentMarks + quizMarks;

        const result = await Result.findOneAndUpdate(
            { module: moduleId, student: studentId },
            {
                module: moduleId,
                student: studentId,
                assignmentMarks,
                quizMarks,
                totalMarks,
                feedback: feedback || "",
                published: true,
                publishedBy: req.user._id
            },
            {
                new: true,
                upsert: true
            }
        )
            .populate("module", "name code")
            .populate("student", "name email")
            .populate("publishedBy", "name email");

        res.json({
            message: "Result published successfully",
            result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getStudentResults = async (req, res) => {
    try {
        const results = await Result.find({
            student: req.user._id,
            published: true
        })
            .populate("module", "name code description")
            .populate("publishedBy", "name email")
            .sort({ createdAt: -1 });

        res.json(results);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getModuleResultsForLecturer = async (req, res) => {
    try {
        const results = await Result.find({
            module: req.params.moduleId
        })
            .populate("module", "name code")
            .populate("student", "name email")
            .populate("publishedBy", "name email")
            .sort({ createdAt: -1 });

        res.json(results);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};