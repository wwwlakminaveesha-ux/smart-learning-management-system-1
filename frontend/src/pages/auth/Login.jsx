import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user?.role === "lecturer") {
      navigate("/lecturer/dashboard");
    } else if (user?.role === "student") {
      navigate("/student/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);
      const userData = response.data;

      login(userData);

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "lecturer") {
        navigate("/lecturer/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.backgroundOverlay}></div>
      <div style={styles.pattern}></div>

      <div style={styles.wrapper}>
        <div style={styles.leftSection}>
          <div style={styles.brandBadge}>Green Learning Platform</div>

          <div style={styles.heroContent}>
            <div style={styles.logoCircle}>
              {/* Replace this with your logo image if needed */}
              <img
                src="/logo.png"
                alt="LMS Logo"
                style={styles.logoImage}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div style={styles.logoFallback}>LMS</div>
            </div>

            <h1 style={styles.heroTitle}>Welcome to NSBM LMS</h1>
            <p style={styles.heroText}>
              Access your learning portal with a modern, secure, and smooth
              experience. Manage courses, assignments, lectures, and student
              activities all in one place.
            </p>

            <div style={styles.featureRow}>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>📘</span>
                <span>Courses</span>
              </div>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>📝</span>
                <span>Assignments</span>
              </div>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>🎓</span>
                <span>Learning</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.card}>
            <div style={styles.cardTop}>
              <h2 style={styles.title}>Sign In</h2>
              <p style={styles.subtitle}>
                Enter your email and password to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              {error ? <p style={styles.error}>{error}</p> : null}

              <button
                type="submit"
                style={{
                  ...styles.button,
                  opacity: loading ? 0.8 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
              </button>
            </form>

            <div style={styles.footerText}>
              Secure access for Admins, Lecturers, and Students
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background:
      "linear-gradient(135deg, #0b3d2e 0%, #0f5132 30%, #198754 65%, #d1fae5 100%)",
    padding: "20px",
  },

  backgroundOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top left, rgba(255,255,255,0.12), transparent 28%), radial-gradient(circle at bottom right, rgba(255,255,255,0.10), transparent 24%)",
    zIndex: 0,
  },

  pattern: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.65))",
    zIndex: 0,
  },

  wrapper: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "1180px",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    borderRadius: "28px",
    overflow: "hidden",
    boxShadow: "0 25px 70px rgba(0,0,0,0.22)",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
  },

  leftSection: {
    padding: "60px 50px",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
  },

  brandBadge: {
    alignSelf: "flex-start",
    padding: "8px 16px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "28px",
    letterSpacing: "0.4px",
  },

  heroContent: {
    maxWidth: "520px",
  },

  logoCircle: {
    width: "88px",
    height: "88px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    overflow: "hidden",
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
    color: "#ffffff",
    fontWeight: "800",
    fontSize: "24px",
    letterSpacing: "1px",
  },

  heroTitle: {
    fontSize: "42px",
    lineHeight: "1.15",
    margin: "0 0 16px 0",
    fontWeight: "800",
  },

  heroText: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "rgba(255,255,255,0.88)",
    marginBottom: "28px",
  },

  featureRow: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },

  featureCard: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
  },

  featureIcon: {
    fontSize: "16px",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    background: "rgba(255,255,255,0.12)",
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    background: "rgba(255,255,255,0.92)",
    borderRadius: "24px",
    padding: "34px",
    boxShadow: "0 18px 45px rgba(0,0,0,0.14)",
    border: "1px solid rgba(255,255,255,0.55)",
  },

  cardTop: {
    marginBottom: "24px",
  },

  title: {
    fontSize: "30px",
    margin: "0 0 8px 0",
    color: "#14532d",
    fontWeight: "800",
  },

  subtitle: {
    margin: 0,
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#166534",
  },

  input: {
    padding: "14px 16px",
    fontSize: "15px",
    borderRadius: "14px",
    border: "1px solid #cfe8d6",
    background: "#f8fffa",
    color: "#1f2937",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
  },

  button: {
    marginTop: "4px",
    padding: "14px 18px",
    fontSize: "15px",
    fontWeight: "700",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #198754, #14532d)",
    color: "#ffffff",
    boxShadow: "0 12px 24px rgba(25,135,84,0.28)",
    transition: "all 0.3s ease",
  },

  error: {
    color: "#dc2626",
    fontSize: "14px",
    margin: 0,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    padding: "10px 12px",
    borderRadius: "10px",
  },

  footerText: {
    marginTop: "20px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "13px",
  },
};

export default Login;