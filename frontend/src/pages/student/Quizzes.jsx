import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

const StudentQuizzes = () => {
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [moduleId, setModuleId] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const fetchQuizzes = async (selectedModuleId) => {
    if (!selectedModuleId) {
      setQuizzes([]);
      setSelectedQuiz(null);
      setAnswers({});
      return;
    }

    try {
      setLoadingQuizzes(true);
      setError("");

      const res = await api.get(`/quizzes/module/${selectedModuleId}`);
      setQuizzes(res.data);
      setSelectedQuiz(null);
      setAnswers({});
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load quizzes");
    } finally {
      setLoadingQuizzes(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    fetchQuizzes(moduleId);
  }, [moduleId]);

  const openQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setAnswers({});
  };

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedAnswer,
    }));
  };

  const submitQuiz = async () => {
    if (!selectedQuiz) return;

    const formattedAnswers = selectedQuiz.questions.map((_, index) => ({
      questionIndex: index,
      selectedAnswer: answers[index] || "",
    }));

    const hasEmpty = formattedAnswers.some((item) => !item.selectedAnswer);

    if (hasEmpty) {
      alert("Please answer all questions before submitting");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/quizzes/attempt", {
        quizId: selectedQuiz._id,
        answers: formattedAnswers,
      });

      alert("Quiz submitted successfully");
      setSelectedQuiz(null);
      setAnswers({});
      await fetchQuizzes(moduleId);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
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
                <h1 style={styles.title}>Quizzes</h1>
                <p style={styles.subtitle}>
                  Attend quizzes for your enrolled modules
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
                Choose a module to view and attend quizzes
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
            loadingQuizzes ? (
              <div style={styles.stateCard}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading quizzes...</p>
              </div>
            ) : selectedQuiz ? (
              <div style={styles.quizCard}>
                <div style={styles.quizHeader}>
                  <div>
                    <div style={styles.quizBadge}>Quiz Attempt</div>
                    <h2 style={styles.quizTitle}>{selectedQuiz.title}</h2>
                    <p style={styles.quizMeta}>
                      <strong>Description:</strong> {selectedQuiz.description || "-"}
                    </p>
                    <p style={styles.quizMeta}>
                      <strong>Duration:</strong> {selectedQuiz.durationMinutes} minutes
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedQuiz(null);
                      setAnswers({});
                    }}
                    style={styles.backBtn}
                  >
                    Back
                  </button>
                </div>

                <div style={styles.questionList}>
                  {selectedQuiz.questions.map((question, qIndex) => (
                    <div key={qIndex} style={styles.questionCard}>
                      <div style={styles.questionNumberBadge}>
                        Question {qIndex + 1}
                      </div>

                      <h3 style={styles.questionTitle}>{question.questionText}</h3>

                      <div style={styles.optionsList}>
                        {question.options.map((option, oIndex) => (
                          <label key={oIndex} style={styles.optionRow}>
                            <input
                              type="radio"
                              name={`question-${qIndex}`}
                              value={option}
                              checked={answers[qIndex] === option}
                              onChange={() => handleAnswerChange(qIndex, option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={submitQuiz}
                  style={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </button>
              </div>
            ) : (
              <div style={styles.listWrapper}>
                {quizzes.map((quiz) => (
                  <div key={quiz._id} style={styles.card}>
                    <div style={styles.cardTopLine}></div>

                    <h2 style={styles.cardTitle}>{quiz.title}</h2>

                    <div style={styles.infoGrid}>
                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Description</span>
                        <span style={styles.infoValue}>
                          {quiz.description || "-"}
                        </span>
                      </div>

                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Questions</span>
                        <span style={styles.countBadge}>
                          {quiz.questions?.length || 0}
                        </span>
                      </div>

                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Duration</span>
                        <span style={styles.durationBadge}>
                          {quiz.durationMinutes} min
                        </span>
                      </div>

                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Start</span>
                        <span style={styles.infoValue}>
                          {new Date(quiz.startDate).toLocaleString()}
                        </span>
                      </div>

                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>End</span>
                        <span style={styles.infoValue}>
                          {new Date(quiz.endDate).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button onClick={() => openQuiz(quiz)} style={styles.button}>
                      Start Quiz
                    </button>
                  </div>
                ))}

                {quizzes.length === 0 && (
                  <div style={styles.emptyState}>
                    No quizzes found for this module.
                  </div>
                )}
              </div>
            )
          ) : (
            !loadingModules && (
              <div style={styles.emptySelectionCard}>
                Please select a module to view quizzes.
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

  button: {
    background: "linear-gradient(135deg, #198754, #14532d)",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "14px",
    cursor: "pointer",
    marginTop: "18px",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 12px 24px rgba(25,135,84,0.18)",
  },

  countBadge: {
    display: "inline-block",
    minWidth: "36px",
    textAlign: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#ecfdf5",
    color: "#14532d",
    fontWeight: "700",
    fontSize: "12px",
    border: "1px solid #bbf7d0",
  },

  durationBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontWeight: "700",
    fontSize: "12px",
    border: "1px solid #bbf7d0",
  },

  quizCard: {
    background: "rgba(255,255,255,0.86)",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.8)",
    boxShadow: "0 15px 40px rgba(16, 24, 40, 0.06)",
    backdropFilter: "blur(10px)",
  },

  quizHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  quizBadge: {
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

  quizTitle: {
    margin: 0,
    fontSize: "26px",
    color: "#14532d",
    fontWeight: "800",
  },

  quizMeta: {
    margin: "8px 0",
    color: "#374151",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  backBtn: {
    background: "#6b7280",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
  },

  questionList: {
    display: "grid",
    gap: "16px",
  },

  questionCard: {
    border: "1px solid #e5f3e8",
    borderRadius: "18px",
    padding: "18px",
    background: "#f9fffb",
    boxShadow: "0 8px 18px rgba(16, 24, 40, 0.03)",
  },

  questionNumberBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontWeight: "700",
    fontSize: "12px",
    marginBottom: "12px",
    border: "1px solid #bbf7d0",
  },

  questionTitle: {
    marginTop: 0,
    marginBottom: "14px",
    color: "#111827",
    fontSize: "18px",
    fontWeight: "700",
  },

  optionsList: {
    display: "grid",
    gap: "10px",
  },

  optionRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#ffffff",
    border: "1px solid #e6f4ea",
    color: "#374151",
    fontWeight: "500",
  },

  submitBtn: {
    background: "linear-gradient(135deg, #16a34a, #166534)",
    color: "#fff",
    border: "none",
    padding: "14px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    marginTop: "24px",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 12px 24px rgba(22,163,74,0.18)",
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

export default StudentQuizzes;