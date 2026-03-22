import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        questionText: {
            type: String,
            required: true
        },
        options: [
            {
                type: String,
                required: true
            }
        ],
        correctAnswer: {
            type: String,
            required: true
        },
        marks: {
            type: Number,
            default: 1
        }
    },
    { _id: false }
);

const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        durationMinutes: {
            type: Number,
            required: true
        },
        questions: [questionSchema],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        isPublished: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Quiz", quizSchema);