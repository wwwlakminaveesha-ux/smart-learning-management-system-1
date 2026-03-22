import User from "../models/User.js";


// GET ALL USERS (ADMIN)

export const getUsers = async(req,res)=>{

    try{

        const users = await User.find()
        .select("-password");

        res.json(users);

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// GET USER COUNT

export const getUserStats = async(req,res)=>{

    try{

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

        res.json({

            totalUsers,
            students,
            lecturers,
            admins

        });

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// UPDATE USER ROLE

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!["admin", "lecturer", "student"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.role = role;
        await user.save();

        res.json({
            message: "Role updated"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



// UPDATE PROFILE

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.name = req.body.name ?? user.name;
        user.email = req.body.email ?? user.email;

        if (typeof req.body.isActive === "boolean") {
            user.isActive = req.body.isActive;
        }

        await user.save();

        res.json({
            message: "User updated",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



// DEACTIVATE USER

export const deactivateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isActive = false;
        await user.save();

        res.json({
            message: "User disabled"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};