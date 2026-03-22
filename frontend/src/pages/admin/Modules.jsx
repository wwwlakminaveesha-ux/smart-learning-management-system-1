import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [lecturer, setLecturer] = useState("");

  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingStudents, setSavingStudents] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [modulesRes, deptRes, usersRes] = await Promise.all([
        api.get("/modules"),
        api.get("/departments"),
        api.get("/users"),
      ]);

      setModules(modulesRes.data);
      setDepartments(deptRes.data);
      setLecturers(usersRes.data.filter((u) => u.role === "lecturer"));
      setStudents(usersRes.data.filter((u) => u.role === "student"));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load modules data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setName("");
    setCode("");
    setDescription("");
    setDepartment("");
    setLecturer("");
  };

  const createModule = async (e) => {
    e.preventDefault();

    if (!name || !code || !department || !lecturer) {
      alert("Please fill module name, code, department, and lecturer");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/modules", {
        name,
        code,
        description,
        department,
        lecturer,
      });

      resetForm();
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteModule = async (id) => {
    const confirmed = window.confirm("Delete module?");
    if (!confirmed) return;

    try {
      await api.delete(`/modules/${id}`);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const openStudents = (moduleItem) => {
    setSelectedModule(moduleItem);
    setSelectedStudents(moduleItem.students?.map((s) => s._id) || []);
  };

  const closeStudents = () => {
    setSelectedModule(null);
    setSelectedStudents([]);
  };

  const toggleStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((s) => s !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const saveStudents = async () => {
    if (!selectedModule) return;

    try {
      setSavingStudents(true);

      await api.put(`/modules/${selectedModule._id}/enroll-students`, {
        studentIds: selectedStudents,
      });

      closeStudents();
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Saving students failed");
    } finally {
      setSavingStudents(false);
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
                <div style={styles.badge}>Academic Module Panel</div>
                <h1 style={styles.title}>Modules</h1>
                <p style={styles.subtitle}>
                  Create modules, assign lecturers, and manage student enrollment
                </p>
              </div>

              <button onClick={fetchData} style={styles.refreshButton}>
                Refresh
              </button>
            </div>
          </div>

          <div style={styles.formCard}>
            <div style={styles.sectionTop}>
              <h2 style={styles.sectionTitle}>Create Module</h2>
              <p style={styles.sectionSubtitle}>
                Add new modules and connect them with departments and lecturers
              </p>
            </div>

            <form onSubmit={createModule} style={styles.form}>
              <input
                placeholder="Module Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />

              <input
                placeholder="Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={styles.input}
              />

              <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.input}
              />

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={styles.input}
              >
                <option value="">Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <select
                value={lecturer}
                onChange={(e) => setLecturer(e.target.value)}
                style={styles.input}
              >
                <option value="">Lecturer</option>
                {lecturers.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name}
                  </option>
                ))}
              </select>

              <button style={styles.button} disabled={submitting}>
                {submitting ? "Adding..." : "Add Module"}
              </button>
            </form>
          </div>

          {loading ? (
            <div style={styles.stateCard}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Loading modules...</p>
            </div>
          ) : error ? (
            <div style={styles.errorCard}>
              <p style={styles.error}>{error}</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <div style={styles.tableHeader}>
                <h2 style={styles.tableTitle}>Module List</h2>
                <p style={styles.tableSubtitle}>
                  View modules, assigned lecturers, departments, and student counts
                </p>
              </div>

              <div style={styles.tableResponsive}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Code</th>
                      <th style={styles.th}>Department</th>
                      <th style={styles.th}>Lecturer</th>
                      <th style={styles.th}>Students</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {modules.map((m) => (
                      <tr key={m._id} style={styles.tr}>
                        <td style={styles.td}>{m.name}</td>
                        <td style={styles.td}>
                          <span style={styles.codeBadge}>{m.code}</span>
                        </td>
                        <td style={styles.td}>{m.department?.name || "-"}</td>
                        <td style={styles.td}>{m.lecturer?.name || "-"}</td>
                        <td style={styles.td}>
                          <span style={styles.studentCountBadge}>
                            {m.students?.length || 0}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionGroup}>
                            <button
                              onClick={() => openStudents(m)}
                              style={styles.manage}
                            >
                              Students
                            </button>

                            <button
                              onClick={() => deleteModule(m._id)}
                              style={styles.delete}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {modules.length === 0 && (
                  <div style={styles.emptyState}>No modules found.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedModule && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <div style={styles.modalTop}>
                <h2 style={styles.modalTitle}>Manage Students</h2>
                <p style={styles.modalSubtitle}>{selectedModule.name}</p>
              </div>

              <div style={styles.studentList}>
                {students.map((s) => (
                  <label key={s._id} style={styles.studentRow}>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(s._id)}
                      onChange={() => toggleStudent(s._id)}
                    />
                    <span>{s.name}</span>
                  </label>
                ))}

                {students.length === 0 && (
                  <p style={styles.noStudents}>No students available.</p>
                )}
              </div>

              <div style={styles.modalActions}>
                <button
                  onClick={saveStudents}
                  style={styles.button}
                  disabled={savingStudents}
                >
                  {savingStudents ? "Saving..." : "Save"}
                </button>

                <button onClick={closeStudents} style={styles.cancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
    marginBottom: "0",
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

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
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
    minWidth: "950px",
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

  codeBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontWeight: "700",
    fontSize: "12px",
    border: "1px solid #bbf7d0",
  },

  studentCountBadge: {
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

  actionGroup: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  manage: {
    background: "linear-gradient(135deg, #16a34a, #166534)",
    border: "none",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    marginRight: "0",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },

  delete: {
    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
    border: "none",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },

  emptyState: {
    padding: "24px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "15px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
    backdropFilter: "blur(5px)",
  },

  modal: {
    width: "460px",
    maxWidth: "95vw",
    background: "rgba(255,255,255,0.96)",
    padding: "28px",
    borderRadius: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.75)",
  },

  modalTop: {
    marginBottom: "18px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "26px",
    color: "#14532d",
    fontWeight: "800",
  },

  modalSubtitle: {
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  studentList: {
    marginTop: "20px",
    maxHeight: "280px",
    overflowY: "auto",
    border: "1px solid #dcfce7",
    borderRadius: "16px",
    padding: "14px",
    background: "#f8fffa",
  },

  studentRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
    cursor: "pointer",
    color: "#374151",
    fontWeight: "600",
    fontSize: "14px",
  },

  noStudents: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  modalActions: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    flexWrap: "wrap",
  },

  cancel: {
    background: "#6b7280",
    border: "none",
    color: "#fff",
    padding: "14px 16px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
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

  loadingText: {
    margin: 0,
    color: "#374151",
    fontSize: "15px",
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

export default Modules;