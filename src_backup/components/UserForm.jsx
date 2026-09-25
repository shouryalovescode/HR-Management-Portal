import { useState } from "react";

/**
 * UserForm Component
 */
function UserForm({
  onSubmit,
  onCancelEdit,
  editingUser,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ============================
  // Validation
  // ============================
  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Minimum 6 characters.";
    }

    const ageNum = Number(age);

    if (!age) {
      newErrors.age = "Age is required.";
    } else if (ageNum < 18 || ageNum > 100) {
      newErrors.age = "Age must be between 18 and 100.";
    }

    const mobileRegex = /^\d{10}$/;

    if (!mobileRegex.test(mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    return newErrors;
  };

  // ============================
  // Clear Form
  // ============================
  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setAge("");
    setMobile("");

    setErrors({});
    setShowPassword(false);
  };

  // ============================
  // Submit
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    await onSubmit({
      name,
      email,
      password,
      age,
      mobile,
    });

    setSuccessMsg("✅ Employee Registered Successfully!");

    clearForm();
  };

  return (
    <div className="home-card">
      <h2 className="form-title">Register New Employee</h2>

      {successMsg && (
        <div className="success-msg">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        <div className="form-group">
          <label>Name</label>

          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {errors.name && (
            <span className="field-error">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {errors.email && (
            <span className="field-error">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>Password</label>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {errors.password && (
            <span className="field-error">
              {errors.password}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>Age</label>

          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          {errors.age && (
            <span className="field-error">
              {errors.age}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>Mobile</label>

          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          {errors.mobile && (
            <span className="field-error">
              {errors.mobile}
            </span>
          )}
        </div>

        <div className="form-actions">

          <button
            type="submit"
            className="btn-submit"
          >
            Register Employee
          </button>

          <button
            type="button"
            className="btn-clear"
            onClick={() => {
              clearForm();

              if (onCancelEdit) {
                onCancelEdit();
              }
            }}
          >
            Clear Form
          </button>

        </div>

      </form>
    </div>
  );
}

export default UserForm;