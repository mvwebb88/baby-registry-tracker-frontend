import { useState } from "react";
import styles from "./CommentForm.module.css";

/**
 * CommentForm
 * - Sends JSON (not FormData) so Flask can read request.get_json()
 * - Uses the correct key: comment_text
 */
const CommentForm = ({ handleAddComment }) => {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = commentText.trim();
    if (!trimmed) {
      setError("Please type a comment.");
      return;
    }

    try {
      setIsSubmitting(true);

      // ✅ Backend expects JSON with comment_text
      await handleAddComment({ comment_text: trimmed });

      setCommentText("");
    } catch (err) {
      console.log(err);
      setError("Comment failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="comment_text">
        Your comment
      </label>

      <div className={styles.row}>
        <textarea
          id="comment_text"
          name="comment_text"
          className={styles.textarea}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write something sweet..."
          rows={3}
        />

        <button
          className={styles.button}
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default CommentForm;


