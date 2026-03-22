import User from "../models/User.js";
import Department from "../models/Department.js";
import Module from "../models/Module.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Quiz from "../models/Quiz.js";
import LectureMaterial from "../models/LectureMaterial.js";
import LectureRecording from "../models/LectureRecording.js";
import Result from "../models/Result.js";

export const getSystemStats = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();

        const students =
        await User.countDocuments({
            role:"student"
        });

        const lecturers =
        await User.countDocuments({
            role:"lecturer"
        });

        const admins =
        await User.countDocuments({
            role:"admin"
        });

        const activeUsers =
        await User.countDocuments({
            isActive:true
        });

        const totalDepartments =
        await Department.countDocuments();

        const totalModules =
        await Module.countDocuments();

        const totalAssignments =
        await Assignment.countDocuments();

        const totalSubmissions =
        await Submission.countDocuments();

        const totalQuizzes =
        await Quiz.countDocuments();

        const totalMaterials =
        await LectureMaterial.countDocuments();

        const totalRecordings =
        await LectureRecording.countDocuments();

        const totalResults =
        await Result.countDocuments();

        res.json({

            users:{
                totalUsers,
                students,
                lecturers,
                admins,
                activeUsers
            },

            academics:{
                totalDepartments,
                totalModules,
                totalAssignments,
                totalSubmissions,
                totalQuizzes
            },

            content:{
                totalMaterials,
                totalRecordings
            },

            results:{
                totalResults
            }

        });

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};