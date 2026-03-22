import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        code: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        description: {
            type: String,
            default: ""
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },
        lecturer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Module", moduleSchema);