import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

const emptyQuestion = {
  questionText: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  marks: 1,
};

const LecturerQuizzes = () => {
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [moduleId, setModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [questions, setQuestions] = useState([{ ...emptyQuestion }]);

  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const fetchQuizzes = async (selectedModuleId) => {
    if (!selectedModuleId) {
      setQuizzes([]);
      return;
    }

    try {
      setLoadingQuizzes(true);
      setError("");

      const res = await api.get(`/quizzes/module/${selectedModuleId}`);
      setQuizzes(res.data);
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

  const addQuestion = () => {
    setQuestions([...questions, { ...emptyQuestion }]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const updateQuestionCorrectAnswer = (index, value) => {
    const updated = [...questions];
    updated[index].correctAnswer = value;
    setQuestions(updated);
  };

  const updateQuestionMarks = (index, value) => {
    const updated = [...questions];
    updated[index].marks = value;
    setQuestions(updated);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setDurationMinutes(30);
    setQuestions([{ ...emptyQuestion }]);
  };

  const createQuiz = async (e) => {
    e.preventDefault();

    if (!moduleId || !title || !startDate || !endDate) {
      alert("Please fill module, title, start date, and end date");
      return;
    }

    const invalidQuestion = questions.find(
      (q) =>
        !q.questionText ||
        q.options.some((opt) => !opt) ||
        !q.correctAnswer ||
        !q.options.includes(q.correctAnswer)
    );

    if (invalidQuestion) {
      alert("Please complete all question fields and set a valid correct answer");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/quizzes", {
        title,
        description,
        module: moduleId,
        startDate,
        endDate,
        durationMinutes: Number(durationMinutes),
        questions: questions.map((q) => ({
          ...q,
          marks: Number(q.marks),
        })),
      });

      resetForm();
      await fetchQuizzes(moduleId);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create quiz");
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
                <div style={styles.badge}>Lecturer Panel</div>
                <h1 style={styles.title}>Quizzes</h1>
                <p style={styles.subtitle}>Create and manage online quizzes</p>
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
                Choose a module to manage quizzes and questions
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
                  <h2 style={styles.sectionTitle}>Create Quiz</h2>
                  <p style={styles.sectionSubtitle}>
                    Add quiz details, timing, and questions for the selected module
                  </p>
                </div>

                <form onSubmit={createQuiz} style={styles.formSection}>
                  <div style={styles.formGrid}>
                    <input
                      placeholder="Quiz Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      style={styles.input}
                    />

                    <input
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={styles.input}
                    />

                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={styles.input}
                    />

                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={styles.input}
                    />

                    <input
                      type="number"
                      min="1"
                      placeholder="Duration (minutes)"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.questionsSection}>
                    <div style={styles.questionSectionHeader}>
                      <h2 style={styles.sectionTitle}>Questions</h2>
                      <span style={styles.questionCountBadge}>
                        {questions.length} Question{questions.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    {questions.map((question, qIndex) => (
                      <div key={qIndex} style={styles.questionCard}>
                        <div style={styles.questionTop}>
                          <h3 style={styles.questionHeading}>
                            Question {qIndex + 1}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            style={styles.removeBtn}
                          >
                            Remove
                          </button>
                        </div>

                        <input
                          placeholder="Question text"
                          value={question.questionText}
                          onChange={(e) =>
                            updateQuestionText(qIndex, e.target.value)
                          }
                          style={styles.input}
                        />

                        <div style={styles.optionsGrid}>
                          {question.options.map((option, oIndex) => (
                            <input
                              key={oIndex}
                              placeholder={`Option ${oIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                updateQuestionOption(qIndex, oIndex, e.target.value)
                              }
                              style={styles.input}
                            />
                          ))}
                        </div>

                        <div style={styles.formGrid}>
                          <input
                            placeholder="Correct answer (must match one option exactly)"
                            value={question.correctAnswer}
                            onChange={(e) =>
                              updateQuestionCorrectAnswer(qIndex, e.target.value)
                            }
                            style={styles.input}
                          />

                          <input
                            type="number"
                            min="1"
                            placeholder="Marks"
                            value={question.marks}
                            onChange={(e) =>
                              updateQuestionMarks(qIndex, e.target.value)
                            }
                            style={styles.input}
                          />
                        </div>
                      </div>
                    ))}

                    <div style={styles.questionActions}>
                      <button
                        type="button"
                        onClick={addQuestion}
                        style={styles.addBtn}
                      >
                        Add Question
                      </button>

                      <button style={styles.submitBtn} disabled={submitting}>
                        {submitting ? "Creating..." : "Create Quiz"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {loadingQuizzes ? (
                <div style={styles.stateCard}>
                  <div style={styles.loadingSpinner}></div>
                  <p style={styles.loadingText}>Loading quizzes...</p>
                </div>
              ) : (
                <div style={styles.tableWrapper}>
                  <div style={styles.tableHeader}>
                    <h2 style={styles.tableTitle}>Quiz List</h2>
                    <p style={styles.tableSubtitle}>
                      View quizzes already created for the selected module
                    </p>
                  </div>

                  <div style={styles.tableResponsive}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Title</th>
                          <th style={styles.th}>Questions</th>
                          <th style={styles.th}>Duration</th>
                          <th style={styles.th}>Start</th>
                          <th style={styles.th}>End</th>
                        </tr>
                      </thead>

                      <tbody>
                        {quizzes.map((quiz) => (
                          <tr key={quiz._id} style={styles.tr}>
                            <td style={styles.td}>{quiz.title}</td>
                            <td style={styles.td}>
                              <span style={styles.countBadge}>
                                {quiz.questions?.length || 0}
                              </span>
                            </td>
                            <td style={styles.td}>
                              <span style={styles.durationBadge}>
                                {quiz.durationMinutes} min
                              </span>
                            </td>
                            <td style={styles.td}>
                              {new Date(quiz.startDate).toLocaleString()}
                            </td>
                            <td style={styles.td}>
                              {new Date(quiz.endDate).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {quizzes.length === 0 && (
                      <div style={styles.emptyState}>No quizzes found.</div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            !loadingModules && (
              <div style={styles.emptySelectionCard}>
                Please select a module to view and manage quizzes.
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

  formSection: {
    marginBottom: 0,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    marginBottom: "16px",
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

  questionsSection: {
    background: "linear-gradient(180deg, #ffffff, #f7fff9)",
    borderRadius: "22px",
    border: "1px solid #dcfce7",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(22, 101, 52, 0.05)",
  },

  questionSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },

  questionCountBadge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontWeight: "700",
    fontSize: "12px",
    border: "1px solid #bbf7d0",
  },

  questionCard: {
    border: "1px solid #e5f3e8",
    borderRadius: "18px",
    padding: "16px",
    marginBottom: "16px",
    background: "#fbfffc",
    boxShadow: "0 8px 18px rgba(16, 24, 40, 0.03)",
  },

  questionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    gap: "10px",
    flexWrap: "wrap",
  },

  questionHeading: {
    margin: 0,
    color: "#14532d",
    fontSize: "18px",
    fontWeight: "800",
  },

  removeBtn: {
    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
    border: "none",
    color: "#fff",
    padding: "9px 13px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },

  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    margin: "12px 0",
  },

  questionActions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  addBtn: {
    background: "linear-gradient(135deg, #16a34a, #166534)",
    border: "none",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 10px 22px rgba(22,163,74,0.16)",
  },

  submitBtn: {
    background: "linear-gradient(135deg, #198754, #14532d)",
    border: "none",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "12px",
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
    minWidth: "850px",
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

export default LecturerQuizzes;