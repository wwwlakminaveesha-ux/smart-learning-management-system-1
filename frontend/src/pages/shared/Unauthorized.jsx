import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
};

export default Unauthorized;