const StatCard = ({ title, value }) => {
  return (
    <div style={styles.card}>
      <div style={styles.topGlow}></div>
      <p style={styles.title}>{title}</p>
      <h3 style={styles.value}>{value}</h3>
    </div>
  );
};

const styles = {
  card: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(180deg, #ffffff, #f0fdf4)",
    border: "1px solid #dcfce7",
    borderRadius: "20px",
    padding: "22px",
    boxShadow: "0 12px 30px rgba(22, 101, 52, 0.08)",
    transition: "all 0.3s ease",
  },

  topGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "5px",
    background: "linear-gradient(90deg, #22c55e, #15803d)",
  },

  title: {
    margin: "0 0 12px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#4b5563",
  },

  value: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "800",
    color: "#14532d",
    lineHeight: 1.2,
  },
};

export default StatCard;