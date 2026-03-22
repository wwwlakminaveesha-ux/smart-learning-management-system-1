import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

const LecturerAssignments = () => {
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [moduleId, setModuleId] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [deadline, setDeadline] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);

  const [gradingData, setGradingData] = useState({});

  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gradingId, setGradingId] = useState("");
  const [error, setError] = useState("");

  const fetchModules = async () => {
    try {
      setLoadingModules(true);
      setError("");

      const res = await api.get("/modules/lecturer/my-modules");
      setModules(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load modules");
    } finally {
      setLoadingModules(false);
    }
  };

  const fetchAssignments = async (selectedModuleId) => {
    if (!selectedModuleId) {
      setAssignments([]);
      setSelectedAssignment(null);
      setSubmissions([]);
      return;
    }

    try {
      setLoadingAssignments(true);
      setError("");

      const res = await api.get(`/assignments/module/${selectedModuleId}`);
      setAssignments(res.data);
      setSelectedAssignment(null);
      setSubmissions([]);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load assignments");
    } finally {
      setLoadingAssignments(false);
    }
  };

  const fetchSubmissions = async (assignment) => {
    try {
      setLoadingSubmissions(true);
      setError("");
      setSelectedAssignment(assignment);

      const res = await api.get(`/submissions/assignment/${assignment._id}`);
      setSubmissions(res.data);

      const initialGradingData = {};
      res.data.forEach((submission) => {
        initialGradingData[submission._id] = {
          marks: submission.marks ?? "",
          feedback: submission.feedback ?? "",
        };
      });
      setGradingData(initialGradingData);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    fetchAssignments(moduleId);
  }, [moduleId]);

  const createAssignment = async (e) => {
    e.preventDefault();

    if (!moduleId || !title || !description || !deadline) {
      alert("Please fill module, title, description, and deadline");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/assignments", {
        title,
        description,
        fileUrl,
        module: moduleId,
        deadline,
        totalMarks: Number(totalMarks),
      });

      setTitle("");
      setDescription("");
      setFileUrl("");
      setDeadline("");
      setTotalMarks(100);

      await fetchAssignments(moduleId);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const updateGradeField = (submissionId, field, value) => {
    setGradingData((prev) => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [field]: value,
      },
    }));
  };

  const gradeSubmission = async (submissionId) => {
    const current = gradingData[submissionId] || {};
    const marks = current.marks;
    const feedback = current.feedback;

    if (marks === "" || marks === null) {
      alert("Please enter marks");
      return;
    }

    try {
      setGradingId(submissionId);

      await api.put(`/submissions/grade/${submissionId}`, {
        marks: Number(marks),
        feedback: feedback || "",
      });

      if (selectedAssignment) {
        await fetchSubmissions(selectedAssignment);
      }

      alert("Submission graded successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to grade submission");
    } finally {
      setGradingId("");
    }
  };

  return (
    <DashboardLayout>
      <div style={styles.page}>
        <div style={styles.backgroundOverlay}></div>
        <div style={styles.pattern}></div>

        <div style={styles.content}>
          <div style={styles.headerCard}>
            <div style={styles.header}>
              <div>
                <div style={styles.badge}>Lecturer Panel</div>
                <h1 style={styles.title}>Assignments</h1>
                <p style={styles.subtitle}>
                  Create assignments, review submissions, and grade student work
                </p>
              </div>

              <button onClick={fetchModules} style={styles.refreshButton}>
                Refresh
              </button>
            </div>
          </div>

          {error ? (
            <div style={styles.errorCard}>
              <p style={styles.error}>{error}</p>
            </div>
          ) : null}

          <div style={styles.selectorCard}>
            <div style={styles.sectionTop}>
              <h2 style={styles.sectionTitle}>Select Module</h2>
              <p style={styles.sectionSubtitle}>
                Choose a module to manage assignments and submissions
              </p>
            </div>

            {loadingModules ? (
              <div style={styles.inlineState}>
                <div style={styles.loadingSpinnerSmall}></div>
                <span style={styles.inlineStateText}>Loading modules...</span>
              </div>
            ) : (
              <select
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                style={styles.select}
              >
                <option value="">Select Module</option>

                {modules.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {moduleId ? (
            <>
              <div style={styles.formCard}>
                <div style={styles.sectionTop}>
                  <h2 style={styles.sectionTitle}>Create Assignment</h2>
                  <p style={styles.sectionSubtitle}>
                    Add a new assignment for the selected module
                  </p>
                </div>

                <form onSubmit={createAssignment} style={styles.form}>
                  <input
                    placeholder="Assignment Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                  />

                  <input
                    placeholder="File URL (optional)"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    style={styles.input}
                  />

                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    style={styles.input}
                  />

                  <input
                    type="number"
                    placeholder="Total Marks"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    style={styles.input}
                    min="1"
                  />

                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.textarea}
                  />

                  <button style={styles.button} disabled={submitting}>
                    {submitting ? "Creating..." : "Add Assignment"}
                  </button>
                </form>
              </div>

              {loadingAssignments ? (
                <div style={styles.stateCard}>
                  <div style={styles.loadingSpinner}></div>
                  <p style={styles.loadingText}>Loading assignments...</p>
                </div>
              ) : (
                <div style={styles.tableWrapper}>
                  <div style={styles.tableHeader}>
                    <h2 style={styles.tableTitle}>Assignment List</h2>
                    <p style={styles.tableSubtitle}>
                      View and manage assignments for the selected module
                    </p>
                  </div>

                  <div style={styles.tableResponsive}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Title</th>
                          <th style={styles.th}>Deadline</th>
                          <th style={styles.th}>Marks</th>
                          <th style={styles.th}>File</th>
                          <th style={styles.th}>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {assignments.map((assignment) => (
                          <tr key={assignment._id} style={styles.tr}>
                            <td style={styles.td}>{assignment.title}</td>
                            <td style={styles.td}>
                              {new Date(assignment.deadline).toLocaleString()}
                            </td>
                            <td style={styles.td}>
                              <span style={styles.marksBadge}>
                                {assignment.totalMarks}
                              </span>
                            </td>
                            <td style={styles.td}>
                              {assignment.fileUrl ? (
                                <a
                                  href={assignment.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={styles.viewLink}
                                >
                                  Open File
                                </a>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td style={styles.td}>
                              <button
                                onClick={() => fetchSubmissions(assignment)}
                                style={styles.viewBtn}
                              >
                                View Submissions
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {assignments.length === 0 && (
                      <div style={styles.emptyState}>No assignments found.</div>
                    )}
                  </div>
                </div>
              )}

              {selectedAssignment ? (
                <div style={styles.submissionSection}>
                  <div style={styles.submissionHeaderCard}>
                    <div>
                      <div style={styles.submissionBadge}>Submission Review</div>
                      <h2 style={styles.sectionTitle}>
                        Submissions — {selectedAssignment.title}
                      </h2>
                    </div>
                  </div>

                  {loadingSubmissions ? (
                    <div style={styles.stateCard}>
                      <div style={styles.loadingSpinner}></div>
                      <p style={styles.loadingText}>Loading submissions...</p>
                    </div>
                  ) : (
                    <div style={styles.tableWrapper}>
                      <div style={styles.tableHeader}>
                        <h2 style={styles.tableTitle}>Submission List</h2>
                        <p style={styles.tableSubtitle}>
                          Review submissions, enter marks, and provide feedback
                        </p>
                      </div>

                      <div style={styles.tableResponsive}>
                        <table style={styles.table}>
                          <thead>
                            <tr>
                              <th style={styles.th}>Student</th>
                              <th style={styles.th}>Submission File</th>
                              <th style={styles.th}>Submitted At</th>
                              <th style={styles.th}>Status</th>
                              <th style={styles.th}>Marks</th>
                              <th style={styles.th}>Feedback</th>
                              <th style={styles.th}>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {submissions.map((submission) => (
                              <tr key={submission._id} style={styles.tr}>
                                <td style={styles.td}>
                                  {submission.student?.name || "-"}
                                </td>
                                <td style={styles.td}>
                                  <a
                                    href={submission.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={styles.viewLink}
                                  >
                                    Open Submission
                                  </a>
                                </td>
                                <td style={styles.td}>
                                  {new Date(submission.submittedAt).toLocaleString()}
                                </td>
                                <td style={styles.td}>
                                  <span style={styles.statusBadge}>
                                    {submission.status}
                                  </span>
                                </td>
                                <td style={styles.td}>
                                  <input
                                    type="number"
                                    min="0"
                                    value={gradingData[submission._id]?.marks ?? ""}
                                    onChange={(e) =>
                                      updateGradeField(
                                        submission._id,
                                        "marks",
                                        e.target.value
                                      )
                                    }
                                    style={styles.smallInput}
                                  />
                                </td>
                                <td style={styles.td}>
                                  <input
                                    type="text"
                                    value={gradingData[submission._id]?.feedback ?? ""}
                                    onChange={(e) =>
                                      updateGradeField(
                                        submission._id,
                                        "feedback",
                                        e.target.value
                                      )
                                    }
                                    style={styles.feedbackInput}
                                  />
                                </td>
                                <td style={styles.td}>
                                  <button
                                    onClick={() => gradeSubmission(submission._id)}
                                    style={styles.gradeBtn}
                                    disabled={gradingId === submission._id}
                                  >
                                    {gradingId === submission._id ? "Saving..." : "Grade"}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {submissions.length === 0 && (
                          <div style={styles.emptyState}>
                            No submissions found for this assignment.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </>
          ) : (
            !loadingModules && (
              <div style={styles.emptySelectionCard}>
                Please select a module to view and manage assignments.
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 35%, #bbf7d0 100%)",
    padding: "24px",
    borderRadius: "24px",
  },

  backgroundOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top left, rgba(22,163,74,0.10), transparent 25%), radial-gradient(circle at bottom right, rgba(21,128,61,0.10), transparent 25%)",
    zIndex: 0,
  },

  pattern: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(22, 163, 74, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(22, 163, 74, 0.08) 1px, transparent 1px)
    `,
    backgroundSize: "36px 36px",
    zIndex: 0,
    opacity: 0.5,
  },

  content: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  headerCard: {
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(255,255,255,0.75)",
    backdropFilter: "blur(12px)",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 15px 40px rgba(16, 24, 40, 0.08)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
    color: "#166534",
    fontWeight: "700",
    fontSize: "12px",
    letterSpacing: "0.4px",
    marginBottom: "14px",
    border: "1px solid #bbf7d0",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    color: "#14532d",
    fontWeight: "800",
    lineHeight: 1.2,
  },

  subtitle: {
    margin: "10px 0 0",
    color: "#4b5563",
    fontSize: "15px",
    lineHeight: 1.6,
  },

  refreshButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #198754, #14532d)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 12px 24px rgba(25,135,84,0.22)",
  },

  selectorCard: {
    background: "rgba(255,255,255,0.82)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 15px 40px rgba(16, 24, 40, 0.06)",
    border: "1px solid rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
  },

  formCard: {
    background: "rgba(255,255,255,0.82)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 15px 40px rgba(16, 24, 40, 0.06)",
    border: "1px solid rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
  },

  sectionTop: {
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    color: "#14532d",
    fontSize: "22px",
    fontWeight: "800",
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  select: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cfe8d6",
    background: "#f8fffa",
    color: "#111827",
    fontSize: "14px",
    outline: "none",
    minWidth: "260px",
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "12px",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cfe8d6",
    outline: "none",
    fontSize: "14px",
    background: "#f8fffa",
    color: "#111827",
    boxSizing: "border-box",
    width: "100%",
  },

  textarea: {
    gridColumn: "span 3",
    minHeight: "110px",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cfe8d6",
    resize: "vertical",
    outline: "none",
    fontSize: "14px",
    background: "#f8fffa",
    color: "#111827",
    boxSizing: "border-box",
    width: "100%",
  },

  button: {
    background: "linear-gradient(135deg, #198754, #14532d)",
    color: "#fff",
    border: "none",
    padding: "14px 16px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 12px 24px rgba(25,135,84,0.18)",
  },

  tableWrapper: {
    background: "rgba(255,255,255,0.82)",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 15px 40px rgba(16, 24, 40, 0.06)",
    border: "1px solid rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
  },

  tableHeader: {
    padding: "24px 24px 8px",
  },

  tableTitle: {
    margin: 0,
    color: "#14532d",
    fontSize: "22px",
    fontWeight: "800",
  },

  tableSubtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  tableResponsive: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "980px",
  },

  th: {
    textAlign: "left",
    padding: "16px",
    background: "#f0fdf4",
    borderBottom: "1px solid #dcfce7",
    color: "#166534",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "0.3px",
  },

  tr: {
    transition: "background 0.2s ease",
  },

  td: {
    padding: "16px",
    borderBottom: "1px solid #edf7ef",
    color: "#111827",
    fontSize: "14px",
    verticalAlign: "middle",
  },

  viewBtn: {
    background: "linear-gradient(135deg, #16a34a, #166534)",
    border: "none",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },

  gradeBtn: {
    background: "linear-gradient(135deg, #198754, #14532d)",
    border: "none",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },

  marksBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontWeight: "700",
    fontSize: "12px",
    border: "1px solid #bbf7d0",
  },

  statusBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#ecfdf5",
    color: "#14532d",
    fontWeight: "700",
    fontSize: "12px",
    border: "1px solid #bbf7d0",
  },

  viewLink: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "10px",
    background: "#ecfdf5",
    color: "#166534",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
    border: "1px solid #bbf7d0",
  },

  submissionSection: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  submissionHeaderCard: {
    background: "rgba(255,255,255,0.82)",
    borderRadius: "24px",
    padding: "22px 24px",
    boxShadow: "0 15px 40px rgba(16, 24, 40, 0.06)",
    border: "1px solid rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
  },

  submissionBadge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
    color: "#166534",
    fontWeight: "700",
    fontSize: "12px",
    marginBottom: "12px",
    border: "1px solid #bbf7d0",
  },

  smallInput: {
    width: "90px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #cfe8d6",
    outline: "none",
    background: "#f8fffa",
  },

  feedbackInput: {
    width: "180px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #cfe8d6",
    outline: "none",
    background: "#f8fffa",
  },

  stateCard: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(255,255,255,0.8)",
    borderRadius: "24px",
    padding: "40px 24px",
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(16, 24, 40, 0.06)",
  },

  loadingSpinner: {
    width: "48px",
    height: "48px",
    margin: "0 auto 16px",
    border: "4px solid #d1fae5",
    borderTop: "4px solid #198754",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingSpinnerSmall: {
    width: "22px",
    height: "22px",
    border: "3px solid #d1fae5",
    borderTop: "3px solid #198754",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    margin: 0,
    color: "#374151",
    fontSize: "15px",
    fontWeight: "600",
  },

  inlineState: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  inlineStateText: {
    color: "#4b5563",
    fontSize: "14px",
    fontWeight: "600",
  },

  emptyState: {
    padding: "24px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "15px",
  },

  emptySelectionCard: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(255,255,255,0.8)",
    borderRadius: "24px",
    padding: "30px 24px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "15px",
    fontWeight: "600",
    boxShadow: "0 15px 40px rgba(16, 24, 40, 0.06)",
  },

  errorCard: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "20px",
    padding: "18px 20px",
    boxShadow: "0 10px 25px rgba(220,38,38,0.06)",
  },

  error: {
    color: "#dc2626",
    fontWeight: "600",
    margin: 0,
  },
};

export default LecturerAssignments;