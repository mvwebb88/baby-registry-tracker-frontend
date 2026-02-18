import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signIn } from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";

import styles from "./SignInForm.module.css";

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;

    // Clear any prior message as the user edits the form
    if (message) setMessage("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (isSubmitting) return;

    setMessage("");
    setIsSubmitting(true);

    try {
      const signedInUser = await signIn(formData);

      // Save user in context
      setUser(signedInUser);

      // ✅ Go to Registry list after login (matches App.jsx + NavBar)
      navigate("/items");
    } catch (err) {
      setMessage(err?.message || "Sign in failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setMessage("");
    navigate("/");
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Sign In</h1>

        <p className={styles.subtitle}>
          Welcome back — sign in to manage your registry.
        </p>

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
              value={formData.username}
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
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.actions}>
            <button
              className={styles.buttonPrimary}
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
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
          Don’t have an account? <Link to="/sign-up">Sign Up</Link>
        </p>
      </section>
    </main>
  );
};

export default SignInForm;





