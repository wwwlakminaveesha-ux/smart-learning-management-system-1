import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

const StudentRecordings = () => {
  const [modules, setModules] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [moduleId, setModuleId] = useState("");

  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingRecordings, setLoadingRecordings] = useState(false);
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

  const fetchRecordings = async (selectedModuleId) => {
    if (!selectedModuleId) {
      setRecordings([]);
      return;
    }

    try {
      setLoadingRecordings(true);
      setError("");

      const res = await api.get(`/recordings/module/${selectedModuleId}`);
      setRecordings(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load recordings");
    } finally {
      setLoadingRecordings(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    fetchRecordings(moduleId);
  }, [moduleId]);

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
                <h1 style={styles.title}>Recordings</h1>
                <p style={styles.subtitle}>
                  View lecture recordings for your enrolled modules
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
                Choose a module to view available lecture recordings
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
            loadingRecordings ? (
              <div style={styles.stateCard}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading recordings...</p>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <div style={styles.tableHeader}>
                  <h2 style={styles.tableTitle}>Recording List</h2>
                  <p style={styles.tableSubtitle}>
                    Browse and open lecture recordings for the selected module
                  </p>
                </div>

                <div style={styles.tableResponsive}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Title</th>
                        <th style={styles.th}>Uploaded By</th>
                        <th style={styles.th}>Video</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recordings.map((recording) => (
                        <tr key={recording._id} style={styles.tr}>
                          <td style={styles.td}>{recording.title}</td>
                          <td style={styles.td}>
                            {recording.uploadedBy?.name || "-"}
                          </td>
                          <td style={styles.td}>
                            <a
                              href={recording.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.viewLink}
                            >
                              Open Video
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {recordings.length === 0 && (
                    <div style={styles.emptyState}>
                      No recordings found for this module.
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            !loadingModules && (
              <div style={styles.emptySelectionCard}>
                Please select a module to view recordings.
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
    minWidth: "750px",
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

export default StudentRecordings;