import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Departments", path: "/admin/departments" },
    { label: "Modules", path: "/admin/modules" },
    { label: "Reports", path: "/admin/reports" },
  ];

  const lecturerLinks = [
    { label: "Dashboard", path: "/lecturer/dashboard" },
    { label: "My Modules", path: "/lecturer/modules" },
    { label: "Materials", path: "/lecturer/materials" },
    { label: "Recordings", path: "/lecturer/recordings" },
    { label: "Assignments", path: "/lecturer/assignments" },
    { label: "Quizzes", path: "/lecturer/quizzes" },
    { label: "Results", path: "/lecturer/results" },
  ];

  const studentLinks = [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "My Modules", path: "/student/modules" },
    { label: "Materials", path: "/student/materials" },
    { label: "Recordings", path: "/student/recordings" },
    { label: "Assignments", path: "/student/assignments" },
    { label: "Quizzes", path: "/student/quizzes" },
    { label: "Results", path: "/student/results" },
  ];

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "lecturer"
      ? lecturerLinks
      : studentLinks;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarOverlay}></div>

      <div style={styles.inner}>
        <div style={styles.brandCard}>
          <div style={styles.logoBox}>
            <img
              src="/logo.png"
              alt="NSBM LMS Logo"
              style={styles.logoImage}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div style={styles.logoFallback}>LMS</div>
          </div>

          <div>
            <h2 style={styles.logo}>NSBM LMS</h2>
            <p style={styles.logoSub}>Learning Management System</p>
          </div>
        </div>

        <div style={styles.roleBadge}>
          {user?.role === "admin"
            ? "Admin Panel"
            : user?.role === "lecturer"
            ? "Lecturer Panel"
            : "Student Panel"}
        </div>

        <nav style={styles.nav}>
          {links.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  ...styles.link,
                  ...(isActive ? styles.activeLink : {}),
                }}
              >
                <span style={styles.linkDot}></span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={styles.bottomCard}>
          <p style={styles.bottomTitle}>Academic Portal</p>
          <p style={styles.bottomText}>
            Manage learning, materials, assignments, quizzes, and results with a
            clean academic workspace.
          </p>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: "270px",
    minHeight: "100vh",
    position: "sticky",
    top: 0,
    background: "linear-gradient(180deg, #0b3d2e 0%, #14532d 45%, #166534 100%)",
    color: "#fff",
    padding: "20px 18px",
    boxSizing: "border-box",
    overflow: "hidden",
    boxShadow: "10px 0 30px rgba(0,0,0,0.10)",
  },

  sidebarOverlay: {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 25%),
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
    backgroundSize: "auto, 34px 34px, 34px 34px",
    opacity: 0.55,
    pointerEvents: "none",
  },

  inner: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },

  brandCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(10px)",
    marginBottom: "18px",
  },

  logoBox: {
    width: "54px",
    height: "54px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },

  logoImage: {
    width: "70%",
    height: "70%",
    objectFit: "contain",
  },

  logoFallback: {
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    fontWeight: "800",
    fontSize: "16px",
    color: "#fff",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "0.2px",
  },

  logoSub: {
    margin: "4px 0 0",
    color: "rgba(255,255,255,0.78)",
    fontSize: "12px",
    lineHeight: 1.4,
  },

  roleBadge: {
    alignSelf: "flex-start",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(187,247,208,0.16)",
    border: "1px solid rgba(187,247,208,0.18)",
    color: "#dcfce7",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.3px",
    marginBottom: "20px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  link: {
    color: "#e5f9ec",
    textDecoration: "none",
    padding: "13px 16px",
    borderRadius: "16px",
    transition: "0.25s ease",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: "600",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid transparent",
  },

  activeLink: {
    background: "linear-gradient(135deg, #22c55e, #15803d)",
    color: "#fff",
    boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.14)",
  },

  linkDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    background: "currentColor",
    opacity: 0.9,
    flexShrink: 0,
  },

  bottomCard: {
    marginTop: "auto",
    padding: "16px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  bottomTitle: {
    margin: "0 0 6px 0",
    fontSize: "14px",
    fontWeight: "800",
    color: "#ffffff",
  },

  bottomText: {
    margin: 0,
    fontSize: "12px",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.78)",
  },
};

export default Sidebar;