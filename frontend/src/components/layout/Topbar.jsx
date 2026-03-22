import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={styles.topbarWrap}>
      <div style={styles.topbar}>
        <div style={styles.left}>
          <div style={styles.avatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h2 style={styles.title}>Welcome, {user?.name}</h2>
            <p style={styles.subtitle}>
              {user?.role?.toUpperCase()} · NSBM LMS Portal
            </p>
          </div>
        </div>

        <div style={styles.right}>
          <div style={styles.statusBadge}>Online</div>

          <button onClick={handleLogout} style={styles.button}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

const styles = {
  topbarWrap: {
    padding: "20px 24px 0 24px",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    background: "rgba(255,255,255,0.75)",
    padding: "18px 22px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.8)",
    boxShadow: "0 10px 30px rgba(16,24,40,0.06)",
    backdropFilter: "blur(12px)",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minWidth: 0,
  },

  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #198754, #14532d)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "20px",
    boxShadow: "0 12px 24px rgba(25,135,84,0.20)",
    flexShrink: 0,
  },

  title: {
    margin: 0,
    fontSize: "21px",
    color: "#14532d",
    fontWeight: "800",
    lineHeight: 1.2,
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: 1.5,
    fontWeight: "600",
    letterSpacing: "0.2px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  statusBadge: {
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "0.3px",
  },

  button: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 12px 24px rgba(239,68,68,0.18)",
  },
};

export default Topbar;