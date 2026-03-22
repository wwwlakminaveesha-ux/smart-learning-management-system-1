import Department from "../models/Department.js";

export const createDepartment = async (req, res) => {
    try {
        const { name, code, description } = req.body;

        const exists = await Department.findOne({
            $or: [{ name }, { code }]
        });

        if (exists) {
            return res.status(400).json({
                message: "Department already exists"
            });
        }

        const department = await Department.create({
            name,
            code,
            description
        });

        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ createdAt: -1 });
        res.json(departments);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        department.name = req.body.name || department.name;
        department.code = req.body.code || department.code;
        department.description = req.body.description ?? department.description;

        await department.save();

        res.json({
            message: "Department updated",
            department
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        await department.deleteOne();

        res.json({
            message: "Department deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};