import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";

export const createQuiz = async (req, res) => {
    try {
        const {
            title,
            description,
            module,
            startDate,
            endDate,
            durationMinutes,
            questions
        } = req.body;

        const quiz = await Quiz.create({
            title,
            description,
            module,
            startDate,
            endDate,
            durationMinutes,
            questions,
            createdBy: req.user._id
        });

        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getModuleQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({
            module: req.params.moduleId
        })
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.json(quizzes);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.json(quiz);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const submitQuizAttempt = async (req, res) => {
    try {
        const { quizId, answers } = req.body;

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        const now = new Date();

        if (now < new Date(quiz.startDate) || now > new Date(quiz.endDate)) {
            return res.status(400).json({
                message: "Quiz is not available at this time"
            });
        }

        const existingAttempt = await QuizAttempt.findOne({
            quiz: quizId,
            student: req.user._id
        });

        if (existingAttempt) {
            return res.status(400).json({
                message: "You have already attempted this quiz"
            });
        }

        let totalScore = 0;

        const evaluatedAnswers = answers.map((answer) => {
            const question = quiz.questions[answer.questionIndex];

            if (!question) {
                return {
                    questionIndex: answer.questionIndex,
                    selectedAnswer: answer.selectedAnswer,
                    isCorrect: false,
                    awardedMarks: 0
                };
            }

            const isCorrect = question.correctAnswer === answer.selectedAnswer;
            const awardedMarks = isCorrect ? question.marks : 0;

            totalScore += awardedMarks;

            return {
                questionIndex: answer.questionIndex,
                selectedAnswer: answer.selectedAnswer,
                isCorrect,
                awardedMarks
            };
        });

        const attempt = await QuizAttempt.create({
            quiz: quizId,
            student: req.user._id,
            answers: evaluatedAnswers,
            totalScore
        });

        res.status(201).json({
            message: "Quiz submitted successfully",
            attempt
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getQuizAttempts = async (req, res) => {
    try {
        const attempts = await QuizAttempt.find({
            quiz: req.params.quizId
        })
            .populate("student", "name email")
            .sort({ createdAt: -1 });

        res.json(attempts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};