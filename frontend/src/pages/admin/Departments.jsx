import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !code) {
      alert("Enter name and code");
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        await api.put(`/departments/${editingId}`, {
          name,
          code,
        });
        setEditingId(null);
      } else {
        await api.post("/departments", {
          name,
          code,
        });
      }

      setName("");
      setCode("");
      fetchDepartments();
    } catch (err) {
      alert(err?.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const editDepartment = (dept) => {
    setName(dept.name);
    setCode(dept.code);
    setEditingId(dept._id);
  };

  const cancelEdit = () => {
    setName("");
    setCode("");
    setEditingId(null);
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete department?")) return;

    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
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
                <div style={styles.badge}>Administration Panel</div>
                <h1 style={styles.pageTitle}>Departments</h1>
                <p style={styles.pageSubtitle}>
                  Manage department records, codes, and academic structure
                </p>
              </div>

              <button onClick={fetchDepartments} style={styles.refreshButton}>
                Refresh
              </button>
            </div>
          </div>

          <div style={styles.formCard}>
            <div style={styles.sectionTop}>
              <h2 style={styles.sectionTitle}>
                {editingId ? "Update Department" : "Add Department"}
              </h2>
              <p style={styles.sectionSubtitle}>
                Create and manage academic departments in the system
              </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                placeholder="Department Name"
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

              <button type="submit" style={styles.primaryButton} disabled={submitting}>
                {submitting
                  ? editingId
                    ? "Updating..."
                    : "Adding..."
                  : editingId
                  ? "Update"
                  : "Add"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {loading ? (
            <div style={styles.stateCard}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Loading departments...</p>
            </div>
          ) : error ? (
            <div style={styles.errorCard}>
              <p style={styles.error}>{error}</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <div style={styles.tableHeader}>
                <h2 style={styles.tableTitle}>Department List</h2>
                <p style={styles.tableSubtitle}>
                  View and manage all departments currently available in the LMS
                </p>
              </div>

              <div style={styles.tableResponsive}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Code</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {departments.map((d) => (
                      <tr key={d._id} style={styles.tr}>
                        <td style={styles.td}>{d.name}</td>
                        <td style={styles.td}>
                          <span style={styles.codeBadge}>{d.code}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionGroup}>
                            <button
                              onClick={() => editDepartment(d)}
                              style={styles.editButton}
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteDepartment(d._id)}
                              style={styles.deleteButton}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {departments.length === 0 && (
                <div style={styles.emptyState}>No departments found.</div>
              )}
            </div>
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

  pageTitle: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "800",
    color: "#14532d",
    lineHeight: 1.2,
  },

  pageSubtitle: {
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
    gridTemplateColumns: "2fr 1fr auto auto",
    gap: "12px",
    alignItems: "center",
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

  primaryButton: {
    background: "linear-gradient(135deg, #198754, #14532d)",
    color: "#fff",
    border: "none",
    padding: "14px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 12px 24px rgba(25,135,84,0.18)",
  },

  cancelButton: {
    background: "#6b7280",
    color: "#fff",
    border: "none",
    padding: "14px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
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
    minWidth: "700px",
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

  actionGroup: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  editButton: {
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    border: "none",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },

  deleteButton: {
    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
    border: "none",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
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

  emptyState: {
    padding: "24px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "15px",
  },
};

export default Departments;