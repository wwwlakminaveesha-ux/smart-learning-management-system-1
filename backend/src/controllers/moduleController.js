import Module from "../models/Module.js";
import Department from "../models/Department.js";
import User from "../models/User.js";

export const createModule = async (req, res) => {
    try {
        const { name, code, description, department, lecturer } = req.body;

        const departmentExists = await Department.findById(department);
        if (!departmentExists) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        const existingModule = await Module.findOne({ code });
        if (existingModule) {
            return res.status(400).json({
                message: "Module code already exists"
            });
        }

        let lecturerUser = null;

        if (lecturer) {
            lecturerUser = await User.findById(lecturer);

            if (!lecturerUser || lecturerUser.role !== "lecturer") {
                return res.status(400).json({
                    message: "Assigned user must be a lecturer"
                });
            }
        }

        const moduleData = await Module.create({
            name,
            code,
            description,
            department,
            lecturer: lecturer || null
        });

        res.status(201).json(moduleData);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getModules = async (req, res) => {
    try {
        const modules = await Module.find()
            .populate("department", "name code")
            .populate("lecturer", "name email role")
            .populate("students", "name email role")
            .sort({ createdAt: -1 });

        res.json(modules);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const updateModule = async (req, res) => {
    try {
        const moduleData = await Module.findById(req.params.id);

        if (!moduleData) {
            return res.status(404).json({
                message: "Module not found"
            });
        }

        if (req.body.department) {
            const departmentExists = await Department.findById(req.body.department);
            if (!departmentExists) {
                return res.status(404).json({
                    message: "Department not found"
                });
            }
            moduleData.department = req.body.department;
        }

        if (req.body.lecturer) {
            const lecturerUser = await User.findById(req.body.lecturer);
            if (!lecturerUser || lecturerUser.role !== "lecturer") {
                return res.status(400).json({
                    message: "Assigned user must be a lecturer"
                });
            }
            moduleData.lecturer = req.body.lecturer;
        }

        moduleData.name = req.body.name || moduleData.name;
        moduleData.code = req.body.code || moduleData.code;
        moduleData.description = req.body.description ?? moduleData.description;

        await moduleData.save();

        res.json({
            message: "Module updated",
            module: moduleData
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const enrollStudentsToModule = async (req, res) => {
    try {
        const { studentIds } = req.body;

        const moduleData = await Module.findById(req.params.id);

        if (!moduleData) {
            return res.status(404).json({
                message: "Module not found"
            });
        }

        if (!Array.isArray(studentIds)) {
            return res.status(400).json({
                message: "studentIds must be an array"
            });
        }

        if (studentIds.length > 0) {
            const students = await User.find({
                _id: { $in: studentIds },
                role: "student"
            });

            if (students.length !== studentIds.length) {
                return res.status(400).json({
                    message: "One or more selected users are not valid students"
                });
            }
        }

        moduleData.students = studentIds;
        await moduleData.save();

        const populatedModule = await Module.findById(moduleData._id)
            .populate("department", "name code")
            .populate("lecturer", "name email role")
            .populate("students", "name email role");

        res.json({
            message: "Students updated successfully",
            module: populatedModule
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const deleteModule = async (req, res) => {
    try {
        const moduleData = await Module.findById(req.params.id);

        if (!moduleData) {
            return res.status(404).json({
                message: "Module not found"
            });
        }

        await moduleData.deleteOne();

        res.json({
            message: "Module deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const getLecturerModules = async (req, res) => {
    try {
        const modules = await Module.find({
            lecturer: req.user._id
        })
            .populate("department", "name code")
            .populate("lecturer", "name email role")
            .populate("students", "name email role")
            .sort({ createdAt: -1 });

        res.json(modules);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const getStudentModules = async (req, res) => {
    try {
        const modules = await Module.find({
            students: req.user._id
        })
            .populate("department", "name code")
            .populate("lecturer", "name email role")
            .sort({ createdAt: -1 });

        res.json(modules);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const getModuleById = async (req, res) => {
    try {
        const moduleData = await Module.findById(req.params.id)
            .populate("department", "name code description")
            .populate("lecturer", "name email role")
            .populate("students", "name email role");

        if (!moduleData) {
            return res.status(404).json({
                message: "Module not found"
            });
        }

        res.json(moduleData);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

