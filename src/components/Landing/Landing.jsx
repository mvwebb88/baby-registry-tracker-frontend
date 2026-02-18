import { useNavigate } from "react-router-dom";
import styles from "./Landing.module.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>
          Welcome to Your Baby Registry
        </h1>

        <p className={styles.subtitle}>
          Sign up or sign in to access your personalized dashboard
          and start organizing everything you need.
        </p>

        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </button>
        </div>
      </section>
    </main>
  );
};

export default Landing;

