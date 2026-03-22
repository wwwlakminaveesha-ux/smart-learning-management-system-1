import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/reports/system");
      setStats(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
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
                <div style={styles.badge}>Administration Panel</div>
                <h1 style={styles.pageTitle}>Admin Dashboard</h1>
                <p style={styles.pageSubtitle}>
                  System overview and academic summary
                </p>
              </div>

              <button onClick={fetchStats} style={styles.refreshButton}>
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div style={styles.stateCard}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Loading dashboard statistics...</p>
            </div>
          ) : error ? (
            <div style={styles.errorCard}>
              <p style={styles.error}>{error}</p>
            </div>
          ) : (
            <>
              <section style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <div>
                    <h2 style={styles.sectionTitle}>Users</h2>
                    <p style={styles.sectionSubtitle}>
                      User base and active account statistics
                    </p>
                  </div>
                </div>

                <div style={styles.grid}>
                  <StatCard title="Total Users" value={stats?.users?.totalUsers ?? 0} />
                  <StatCard title="Students" value={stats?.users?.students ?? 0} />
                  <StatCard title="Lecturers" value={stats?.users?.lecturers ?? 0} />
                  <StatCard title="Admins" value={stats?.users?.admins ?? 0} />
                  <StatCard title="Active Users" value={stats?.users?.activeUsers ?? 0} />
                </div>
              </section>

              <section style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <div>
                    <h2 style={styles.sectionTitle}>Academics</h2>
                    <p style={styles.sectionSubtitle}>
                      Departments, modules, and assessment activities
                    </p>
                  </div>
                </div>

                <div style={styles.grid}>
                  <StatCard title="Departments" value={stats?.academics?.totalDepartments ?? 0} />
                  <StatCard title="Modules" value={stats?.academics?.totalModules ?? 0} />
                  <StatCard title="Assignments" value={stats?.academics?.totalAssignments ?? 0} />
                  <StatCard title="Submissions" value={stats?.academics?.totalSubmissions ?? 0} />
                  <StatCard title="Quizzes" value={stats?.academics?.totalQuizzes ?? 0} />
                </div>
              </section>

              <section style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <div>
                    <h2 style={styles.sectionTitle}>Content</h2>
                    <p style={styles.sectionSubtitle}>
                      Learning materials, recordings, and results summary
                    </p>
                  </div>
                </div>

                <div style={styles.grid}>
                  <StatCard title="Materials" value={stats?.content?.totalMaterials ?? 0} />
                  <StatCard title="Recordings" value={stats?.content?.totalRecordings ?? 0} />
                  <StatCard title="Results" value={stats?.results?.totalResults ?? 0} />
                </div>
              </section>
            </>
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
    transition: "all 0.3s ease",
  },

  sectionCard: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 15px 40px rgba(16, 24, 40, 0.06)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    gap: "12px",
    flexWrap: "wrap",
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

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
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

export default AdminDashboard;