import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div style={styles.main}>
        <Topbar />
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },

  content: {
    padding: "24px",
  },
};

export default DashboardLayout;