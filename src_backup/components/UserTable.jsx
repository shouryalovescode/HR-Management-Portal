/**
 * UserTable Component
 * Displays all registered employees in a responsive table.
 * Supports edit and delete (with confirmation) actions per row.
 */
function UserTable({ users, onEdit, onDelete }) {
  /** Handle delete with browser confirmation dialog */
  const handleDelete = (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?`
    );
    if (confirmed) {
      onDelete(user.id);
    }
  };

  // ── Empty state ──
  if (!users || users.length === 0) {
    return (
      <div className="table-empty">
        <span className="empty-icon">📋</span>
        <p>No employees registered yet.</p>
        <p className="empty-sub">
          Fill in the form above to add the first employee.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <h2 className="table-title"> Registered Employees ({users.length})</h2>
      <div className="table-scroll">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Age</th>
              <th>Mobile Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} style={{ animationDelay: `${index * 0.05}s` }}>
                <td data-label="ID">{user.id}</td>
                <td data-label="Name">{user.name}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Password">{"•".repeat(user.password.length)}</td>
                <td data-label="Age">{user.age}</td>
                <td data-label="Mobile">{user.mobile}</td>
                <td data-label="Actions">
                  <div className="action-btns">
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(user)}
                      title="Edit employee"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user)}
                      title="Delete employee"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;
