import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
    {
        questionIndex: {
            type: Number,
            required: true
        },
        selectedAnswer: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            default: false
        },
        awardedMarks: {
            type: Number,
            default: 0
        }
    },
    { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
    {
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        answers: [answerSchema],
        totalScore: {
            type: Number,
            default: 0
        },
        submittedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("QuizAttempt", quizAttemptSchema);