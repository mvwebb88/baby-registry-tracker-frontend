// src/components/SignUpForm/SignUpForm.jsx
import { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signUp } from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";

import styles from "./SignUpForm.module.css";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
    dueDate: "",
  });

  const { username, password, passwordConf, dueDate } = formData;

  const handleChange = (evt) => {
    const { name, value } = evt.target;

    if (message) setMessage("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const passwordMismatch = useMemo(() => {
    if (!password || !passwordConf) return false;
    return password !== passwordConf;
  }, [password, passwordConf]);

  const isFormInvalid = useMemo(() => {
    return !username || !password || !passwordConf || !dueDate || passwordMismatch;
  }, [username, password, passwordConf, dueDate, passwordMismatch]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (isSubmitting) return;

    setMessage("");
    setIsSubmitting(true);

    // Optional: front-end guard for mismatch
    if (password !== passwordConf) {
      setMessage("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const newUser = await signUp(formData);

      // ✅ Save user in context
      setUser(newUser);

      // ✅ Store due date locally for countdown pill (expects YYYY-MM-DD)
      localStorage.setItem(`dueDate_${newUser.username}`, dueDate);


      // ✅ Go straight to registry list after sign up
      navigate("/items", { replace: true });
    } catch (err) {
      setMessage(err?.message || "Sign up failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setMessage("");
    navigate("/", { replace: true });
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Sign Up</h1>
        <p className={styles.subtitle}>Create an account to start your registry.</p>

        {message && <p className={styles.message}>{message}</p>}

        <form className={styles.form} autoComplete="off" onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input
              className={styles.input}
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              className={styles.input}
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="passwordConf">
              Confirm Password
            </label>
            <input
              className={styles.input}
              type="password"
              id="passwordConf"
              name="passwordConf"
              value={passwordConf}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="dueDate">
              Due Date
            </label>
            <input
              className={styles.input}
              type="date"
              id="dueDate"
              name="dueDate"
              value={dueDate}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          {passwordMismatch && (
            <p className={styles.message}>Passwords do not match.</p>
          )}

          <div className={styles.actions}>
            <button
              className={styles.buttonPrimary}
              type="submit"
              disabled={isFormInvalid || isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>

            <button
              type="button"
              className={styles.buttonGhost}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link to="/sign-in">Sign In</Link>
        </p>
      </section>
    </main>
  );
};

export default SignUpForm;





