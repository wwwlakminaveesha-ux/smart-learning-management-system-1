import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

const LecturerModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/modules/lecturer/my-modules");
      setModules(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load lecturer modules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

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
                <h1 style={styles.title}>My Modules</h1>
                <p style={styles.subtitle}>Modules assigned to you</p>
              </div>

              <button onClick={fetchModules} style={styles.refreshButton}>
                Refresh
              </button>
            </div>
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
            <div style={styles.grid}>
              {modules.map((moduleItem) => (
                <div key={moduleItem._id} style={styles.card}>
                  <div style={styles.cardTopLine}></div>

                  <div style={styles.cardHeader}>
                    <div>
                      <h2 style={styles.moduleTitle}>{moduleItem.name}</h2>
                      <div style={styles.codeBadge}>{moduleItem.code}</div>
                    </div>
                  </div>

                  <div style={styles.metaList}>
                    <div style={styles.metaRow}>
                      <span style={styles.metaLabel}>Department</span>
                      <span style={styles.metaValue}>
                        {moduleItem.department?.name || "-"}
                      </span>
                    </div>

                    <div style={styles.metaRow}>
                      <span style={styles.metaLabel}>Students</span>
                      <span style={styles.studentCountBadge}>
                        {moduleItem.students?.length || 0}
                      </span>
                    </div>

                    <div style={styles.descriptionBox}>
                      <span style={styles.metaLabel}>Description</span>
                      <p style={styles.descriptionText}>
                        {moduleItem.description || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {modules.length === 0 && (
                <div style={styles.emptyState}>
                  No modules assigned yet.
                </div>
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

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "18px",
  },

  moduleTitle: {
    margin: "0 0 10px 0",
    fontSize: "24px",
    color: "#14532d",
    fontWeight: "800",
    lineHeight: 1.3,
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

  metaList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    padding: "12px 0",
    borderBottom: "1px solid #edf7ef",
  },

  metaLabel: {
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.2px",
  },

  metaValue: {
    color: "#111827",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "right",
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

  descriptionBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingTop: "4px",
  },

  descriptionText: {
    margin: 0,
    color: "#374151",
    fontSize: "14px",
    lineHeight: 1.7,
    background: "#f8fffa",
    border: "1px solid #e6f4ea",
    borderRadius: "16px",
    padding: "14px",
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

export default LecturerModules;