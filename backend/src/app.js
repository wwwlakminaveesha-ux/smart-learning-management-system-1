import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import recordingRoutes from "./routes/recordingRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
// app.use("/api/users",userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/materials",materialRoutes);
app.use("/api/recordings",recordingRoutes);
app.use("/api/assignments",assignmentRoutes);
app.use("/api/submissions",submissionRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/reports",reportRoutes);

app.get("/", (req, res) => {
  res.send("LMS API is running...");
});

export default app;