import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [creatingUser, setCreatingUser] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    isActive: true,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createUser = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill name, email, and password");
      return;
    }

    try {
      setCreatingUser(true);

      await api.post("/auth/register", formData);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      await fetchUsers();
      alert("User created successfully as student");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create user");
    } finally {
      setCreatingUser(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      setActionLoadingId(userId);

      await api.put(`/users/${userId}`, {
        isActive: !currentStatus,
      });

      await fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update user status");
    } finally {
      setActionLoadingId("");
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setActionLoadingId(userId);

      await api.put(`/users/role/${userId}`, {
        role: newRole,
      });

      await fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update role");
    } finally {
      setActionLoadingId("");
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditData({
      name: user.name || "",
      email: user.email || "",
      isActive: !!user.isActive,
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditData({
      name: "",
      email: "",
      isActive: true,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveUserEdit = async () => {
    if (!editingUser) return;

    if (!editData.name || !editData.email) {
      alert("Please fill name and email");
      return;
    }

    try {
      setSavingEdit(true);

      await api.put(`/users/${editingUser._id}`, {
        name: editData.name,
        email: editData.email,
        isActive: editData.isActive,
      });

      await fetchUsers();
      closeEditModal();
      alert("User updated successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update user");
    } finally {
      setSavingEdit(false);
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
                <h1 style={styles.title}>Users Management</h1>
                <p style={styles.subtitle}>
                  View, create, edit, and manage LMS users
                </p>
              </div>

              <button onClick={fetchUsers} style={styles.refreshButton}>
                Refresh
              </button>
            </div>
          </div>

          <form onSubmit={createUser} style={styles.formCard}>
            <div style={styles.sectionTop}>
              <div>
                <h2 style={styles.formTitle}>Add User</h2>
                <p style={styles.sectionSubtitle}>
                  Create a new LMS user account with the default student role
                </p>
              </div>
            </div>

            <div style={styles.formGrid}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleCreateChange}
                style={styles.input}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleCreateChange}
                style={styles.input}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleCreateChange}
                style={styles.input}
              />

              <button
                type="submit"
                style={styles.createButton}
                disabled={creatingUser}
              >
                {creatingUser ? "Creating..." : "Add User"}
              </button>
            </div>

            <p style={styles.helperText}>
              New users are created as <strong>students</strong> by default. You
              can change the role from the table below.
            </p>
          </form>

          {loading ? (
            <div style={styles.stateCard}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Loading users...</p>
            </div>
          ) : error ? (
            <div style={styles.errorCard}>
              <p style={styles.error}>{error}</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <div style={styles.tableHeader}>
                <h2 style={styles.tableTitle}>All Users</h2>
                <p style={styles.tableSubtitle}>
                  Manage roles, activity status, and account details
                </p>
              </div>

              <div style={styles.tableResponsive}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} style={styles.tr}>
                        <td style={styles.td}>{user.name}</td>
                        <td style={styles.td}>{user.email}</td>

                        <td style={styles.td}>
                          <select
                            value={user.role}
                            onChange={(e) =>
                              updateUserRole(user._id, e.target.value)
                            }
                            disabled={
                              actionLoadingId === user._id ||
                              user.role === "admin"
                            }
                            style={styles.roleSelect}
                          >
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        <td style={styles.td}>
                          {user.isActive ? (
                            <span style={styles.activeBadge}>Active</span>
                          ) : (
                            <span style={styles.inactiveBadge}>Inactive</span>
                          )}
                        </td>

                        <td style={styles.td}>
                          <div style={styles.actionGroup}>
                            <button
                              type="button"
                              onClick={() => openEditModal(user)}
                              style={styles.editBtn}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                toggleUserStatus(user._id, user.isActive)
                              }
                              disabled={actionLoadingId === user._id}
                              style={
                                user.isActive
                                  ? styles.deactivateBtn
                                  : styles.activateBtn
                              }
                            >
                              {actionLoadingId === user._id
                                ? "Updating..."
                                : user.isActive
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {users.length === 0 && (
                <div style={styles.emptyState}>No users found.</div>
              )}
            </div>
          )}
        </div>

        {editingUser && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <div style={styles.modalTop}>
                <h2 style={styles.modalTitle}>Edit User</h2>
                <p style={styles.modalSubtitle}>
                  Update user details and activity status
                </p>
              </div>

              <div style={styles.modalGrid}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={editData.name}
                  onChange={handleEditChange}
                  style={styles.input}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={editData.email}
                  onChange={handleEditChange}
                  style={styles.input}
                />

                <label style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={editData.isActive}
                    onChange={handleEditChange}
                  />
                  Active User
                </label>
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={saveUserEdit}
                  style={styles.createButton}
                  disabled={savingEdit}
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={closeEditModal}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
    fontWeight: "800",
    color: "#14532d",
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

  formTitle: {
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

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "12px",
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

  createButton: {
    background: "linear-gradient(135deg, #198754, #14532d)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px 16px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 12px 24px rgba(25,135,84,0.18)",
  },

  helperText: {
    marginTop: "14px",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.6,
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
    minWidth: "900px",
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

  roleSelect: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #cfe8d6",
    background: "#ffffff",
    color: "#14532d",
    fontWeight: "600",
    outline: "none",
  },

  activeBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontWeight: "700",
    fontSize: "12px",
    border: "1px solid #bbf7d0",
  },

  inactiveBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: "12px",
    border: "1px solid #fecaca",
  },

  actionGroup: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  editBtn: {
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    border: "none",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },

  deactivateBtn: {
    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
    border: "none",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },

  activateBtn: {
    background: "linear-gradient(135deg, #22c55e, #15803d)",
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

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
    backdropFilter: "blur(5px)",
  },

  modal: {
    width: "460px",
    maxWidth: "95vw",
    background: "rgba(255,255,255,0.96)",
    padding: "28px",
    borderRadius: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.75)",
  },

  modalTop: {
    marginBottom: "18px",
  },

  modalTitle: {
    marginTop: 0,
    marginBottom: "6px",
    fontSize: "26px",
    color: "#14532d",
    fontWeight: "800",
  },

  modalSubtitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  modalGrid: {
    display: "grid",
    gap: "14px",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#374151",
    fontWeight: "600",
    fontSize: "14px",
  },

  modalActions: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    flexWrap: "wrap",
  },

  cancelBtn: {
    background: "#6b7280",
    border: "none",
    color: "#fff",
    padding: "14px 16px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },
};

export default Users;