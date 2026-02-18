// src/components/NavBar/NavBar.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import styles from "./NavBar.module.css";
import { UserContext } from "../../contexts/UserContext";

export default function NavBar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // ✅ User-specific due date key (prevents other users seeing mvwebb's due date)
  const dueDateKey = useMemo(() => {
    return user?.username ? `dueDate_${user.username}` : null;
  }, [user?.username]);

  // ✅ Only compute due date when logged in
  const dueDate = useMemo(() => {
    if (!dueDateKey) return null;

    const saved = localStorage.getItem(dueDateKey); // "YYYY-MM-DD"
    if (saved) {
      const parsed = new Date(saved);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }

    // fallback (demo-safe)
    return new Date(2026, 5, 24);
  }, [dueDateKey]);

  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    if (!dueDate) {
      setDaysLeft(null);
      return;
    }

    const computeDaysLeft = () => {
      const now = new Date();

      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfDue = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

      const msPerDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.ceil((startOfDue - startOfToday) / msPerDay);

      setDaysLeft(diffDays);
    };

    computeDaysLeft();
    const intervalId = setInterval(computeDaysLeft, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [dueDate]);

  const initials = user?.username?.trim()?.[0]?.toUpperCase() || "U";

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const countdownLabel =
    daysLeft === null
      ? "Loading…"
      : daysLeft > 0
      ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} to go`
      : daysLeft === 0
      ? "Due today 💙"
      : "Past due date";

  const dueDateLabel = dueDate ? dueDate.toLocaleDateString() : "";

  return (
    <header className={styles.navWrap}>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandTitle}>Baby Registry</span>

          {/* ✅ Hide countdown pill when logged out */}
          {user && dueDate && (
            <span className={styles.countdownPill} title={`Due ${dueDateLabel}`}>
              <span className={styles.countdownStrong}>{countdownLabel}</span>
              <span className={styles.countdownSub}>Due {dueDateLabel}</span>
            </span>
          )}
        </div>

        <div className={styles.links}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
          >
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/items"
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
              >
                Registry
              </NavLink>

              <NavLink
                to="/items/new"
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
              >
                Add Item
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/sign-up"
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
              >
                Sign Up
              </NavLink>

              <NavLink
                to="/sign-in"
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
              >
                Sign In
              </NavLink>
            </>
          )}
        </div>

        <div className={styles.right}>
          {user && (
            <>
              <div className={styles.userPill} title={user.username}>
                <span className={styles.avatar}>{initials}</span>
                <span>{user.username}</span>
              </div>

              <button className={styles.button} type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}







