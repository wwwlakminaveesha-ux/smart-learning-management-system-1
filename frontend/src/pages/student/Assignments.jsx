import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

const StudentAssignments = () => {
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);

  const [moduleId, setModuleId] = useState("");
  const [submissionUrls, setSubmissionUrls] = useState({});

  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submittingId, setSubmittingId] = useState("");
  const [error, setError] = useState("");

  const fetchModules = async () => {
    try {
      setLoadingModules(true);
      setError("");

      const res = await api.get("/modules/student/my-modules");
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
      return;
    }

    try {
      setLoadingAssignments(true);
      setError("");

      const res = await api.get(`/assignments/module/${selectedModuleId}`);
      setAssignments(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load assignments");
    } finally {
      setLoadingAssignments(false);
    }
  };

  const fetchMySubmissions = async () => {
    try {
      setLoadingSubmissions(true);
      const res = await api.get("/submissions/my-submissions");
      setMySubmissions(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    fetchModules();
    fetchMySubmissions();
  }, []);

  useEffect(() => {
    fetchAssignments(moduleId);
  }, [moduleId]);

  const submissionsMap = useMemo(() => {
    const map = {};
    mySubmissions.forEach((submission) => {
      if (submission.assignment?._id) {
        map[submission.assignment._id] = submission;
      }
    });
    return map;
  }, [mySubmissions]);

  const handleSubmissionUrlChange = (assignmentId, value) => {
    setSubmissionUrls((prev) => ({
      ...prev,
      [assignmentId]: value,
    }));
  };

  const submitAssignment = async (assignmentId) => {
    const fileUrl = submissionUrls[assignmentId];

    if (!fileUrl) {
      alert("Please enter submission file URL");
      return;
    }

    try {
      setSubmittingId(assignmentId);

      await api.post("/submissions", {
        assignment: assignmentId,
        fileUrl,
      });

      alert("Assignment submitted successfully");

      setSubmissionUrls((prev) => ({
        ...prev,
        [assignmentId]: "",
      }));

      await fetchMySubmissions();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit assignment");
    } finally {
      setSubmittingId("");
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
                <div style={styles.badge}>Student Panel</div>
                <h1 style={styles.title}>Assignments</h1>
                <p style={styles.subtitle}>
                  View, submit, and track your assignments
                </p>
              </div>

              <button
                onClick={fetchMySubmissions}
                style={styles.refreshButton}
                disabled={loadingSubmissions}
              >
                {loadingSubmissions ? "Refreshing..." : "Refresh Status"}
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
                Choose a module to view assignments and submit your work
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
            loadingAssignments ? (
              <div style={styles.stateCard}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading assignments...</p>
              </div>
            ) : (
              <div style={styles.listWrapper}>
                {assignments.map((assignment) => {
                  const submission = submissionsMap[assignment._id];
                  const alreadySubmitted = Boolean(submission);

                  return (
                    <div key={assignment._id} style={styles.card}>
                      <div style={styles.cardTopLine}></div>

                      <div style={styles.cardTop}>
                        <div style={styles.cardMain}>
                          <h2 style={styles.cardTitle}>{assignment.title}</h2>

                          <div style={styles.infoGrid}>
                            <div style={styles.infoRow}>
                              <span style={styles.infoLabel}>Description</span>
                              <span style={styles.infoValue}>
                                {assignment.description || "-"}
                              </span>
                            </div>

                            <div style={styles.infoRow}>
                              <span style={styles.infoLabel}>Deadline</span>
                              <span style={styles.infoValue}>
                                {new Date(assignment.deadline).toLocaleString()}
                              </span>
                            </div>

                            <div style={styles.infoRow}>
                              <span style={styles.infoLabel}>Total Marks</span>
                              <span style={styles.marksBadge}>
                                {assignment.totalMarks}
                              </span>
                            </div>

                            <div style={styles.infoRow}>
                              <span style={styles.infoLabel}>Created By</span>
                              <span style={styles.infoValue}>
                                {assignment.createdBy?.name || "-"}
                              </span>
                            </div>

                            <div style={styles.infoRow}>
                              <span style={styles.infoLabel}>Assignment File</span>
                              <span style={styles.infoValue}>
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
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {alreadySubmitted ? (
                            <span style={styles.submittedBadge}>Submitted</span>
                          ) : (
                            <span style={styles.pendingBadge}>Not Submitted</span>
                          )}
                        </div>
                      </div>

                      {alreadySubmitted ? (
                        <div style={styles.statusBox}>
                          <div style={styles.statusGrid}>
                            <div style={styles.infoRow}>
                              <span style={styles.infoLabel}>Your File</span>
                              <span style={styles.infoValue}>
                                <a
                                  href={submission.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={styles.viewLink}
                                >
                                  Open Submission
                                </a>
                              </span>
                            </div>

                            <div style={styles.infoRow}>
                              <span style={styles.infoLabel}>Submitted At</span>
                              <span style={styles.infoValue}>
                                {new Date(submission.submittedAt).toLocaleString()}
                              </span>
                            </div>

                            <div style={styles.infoRow}>
                              <span style={styles.infoLabel}>Status</span>
                              <span style={styles.statusBadge}>
                                {submission.status}
                              </span>
                            </div>

                            <div style={styles.infoRow}>
                              <span style={styles.infoLabel}>Marks</span>
                              <span style={styles.marksBadge}>
                                {submission.marks !== null ? submission.marks : "-"}
                              </span>
                            </div>

                            <div style={styles.feedbackBox}>
                              <span style={styles.infoLabel}>Feedback</span>
                              <p style={styles.feedbackText}>
                                {submission.feedback || "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={styles.submitBox}>
                          <input
                            type="text"
                            placeholder="Enter your submission file URL"
                            value={submissionUrls[assignment._id] || ""}
                            onChange={(e) =>
                              handleSubmissionUrlChange(
                                assignment._id,
                                e.target.value
                              )
                            }
                            style={styles.input}
                          />

                          <button
                            onClick={() => submitAssignment(assignment._id)}
                            style={styles.button}
                            disabled={submittingId === assignment._id}
                          >
                            {submittingId === assignment._id
                              ? "Submitting..."
                              : "Submit Assignment"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {assignments.length === 0 && (
                  <div style={styles.emptyState}>
                    No assignments found for this module.
                  </div>
                )}
              </div>
            )
          ) : (
            !loadingModules && (
              <div style={styles.emptySelectionCard}>
                Please select a module to view assignments.
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

  listWrapper: {
    display: "grid",
    gap: "20px",
  },

  card: {
    position: "relative",
    overflow: "hidden",
    background: "rgba(255,255,255,0.86)",
    borderRadius: "24px",
    padding: "22px",
    border: "1px solid rgba(255,255,255,0.8)",
    boxShadow: "0 15px 40px rgba(16, 24, 40, 0.06)",
    backdropFilter: "blur(10px)",
  },

  cardTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "5px",
    background: "linear-gradient(90deg, #22c55e, #15803d)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },

  cardMain: {
    flex: 1,
    minWidth: "260px",
  },

  cardTitle: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "24px",
    color: "#14532d",
    fontWeight: "800",
  },

  infoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    padding: "10px 0",
    borderBottom: "1px solid #edf7ef",
    flexWrap: "wrap",
  },

  infoLabel: {
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.2px",
  },

  infoValue: {
    color: "#111827",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "right",
  },

  submitBox: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "12px",
    marginTop: "18px",
    alignItems: "center",
  },

  statusBox: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "18px",
    background: "#f8fffa",
    border: "1px solid #e6f4ea",
  },

  statusGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  feedbackBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingTop: "4px",
  },

  feedbackText: {
    margin: 0,
    color: "#374151",
    fontSize: "14px",
    lineHeight: 1.7,
    background: "#ffffff",
    border: "1px solid #e6f4ea",
    borderRadius: "14px",
    padding: "14px",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cfe8d6",
    outline: "none",
    fontSize: "14px",
    background: "#ffffff",
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

  submittedBadge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontWeight: "700",
    whiteSpace: "nowrap",
    border: "1px solid #bbf7d0",
    fontSize: "12px",
  },

  pendingBadge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#fef3c7",
    color: "#92400e",
    fontWeight: "700",
    whiteSpace: "nowrap",
    border: "1px solid #fde68a",
    fontSize: "12px",
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

  emptyState: {
    background: "rgba(255,255,255,0.86)",
    padding: "24px",
    borderRadius: "24px",
    color: "#6b7280",
    border: "1px solid rgba(255,255,255,0.8)",
    boxShadow: "0 15px 40px rgba(16, 24, 40, 0.06)",
    textAlign: "center",
    fontSize: "15px",
    fontWeight: "600",
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

export default StudentAssignments;