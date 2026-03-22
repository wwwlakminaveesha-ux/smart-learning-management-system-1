import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: true
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        assignmentMarks: {
            type: Number,
            default: 0
        },
        quizMarks: {
            type: Number,
            default: 0
        },
        totalMarks: {
            type: Number,
            default: 0
        },
        feedback: {
            type: String,
            default: ""
        },
        published: {
            type: Boolean,
            default: false
        },
        publishedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true
    }
);

resultSchema.index({ module: 1, student: 1 }, { unique: true });

export default mongoose.model("Result", resultSchema);