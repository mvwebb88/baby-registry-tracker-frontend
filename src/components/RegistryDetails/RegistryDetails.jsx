import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext, useMemo } from "react";

import * as registryService from "../../services/registryService";
import { UserContext } from "../../contexts/UserContext";
import CommentForm from "../CommentForm/CommentForm";

import styles from "./RegistryDetails.module.css";

const RegistryDetails = ({ handleDeleteItem }) => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemData = await registryService.show(itemId);
        setItem(itemData);
      } catch (err) {
        console.log(err);
      }
    };

    if (itemId) fetchItem();
  }, [itemId]);

  const handleAddComment = async (commentFormData) => {
    try {
      const res = await registryService.createComment(itemId, commentFormData);

      if (res && res.id && Array.isArray(res.comments)) {
        setItem(res);
        return;
      }

      setItem((prev) => ({
        ...prev,
        comments: prev?.comments ? [res, ...prev.comments] : [res],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const isOwner = useMemo(() => {
    return Boolean(user && item && item.item_owner_id === user.id);
  }, [user, item]);

  const createdDateLabel = useMemo(() => {
    if (!item?.created_at) return "Unknown date";
    const d = new Date(item.created_at);
    return Number.isNaN(d.getTime()) ? "Unknown date" : d.toLocaleDateString();
  }, [item]);

  const priceLabel = useMemo(() => {
    if (item?.price === null || item?.price === undefined || item?.price === "")
      return "—";
    const n = Number(item.price);
    if (Number.isNaN(n)) return String(item.price);
    return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
  }, [item]);

  const safeLink = useMemo(() => {
    const raw = item?.link?.trim();
    if (!raw) return null;
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return `https://${raw}`;
  }, [item]);

  const statusPillClass =
    item?.status === "Purchased" ? styles.pillPurchased : styles.pillNeeded;

  const priorityPillClass =
    item?.priority === "High"
      ? styles.pillHigh
      : item?.priority === "Low"
      ? styles.pillLow
      : styles.pillMedium;

  if (!item) return <main className={styles.container}>Loading...</main>;

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>{item.item_name}</h1>
            <p className={styles.meta}>
              {`${item.owner_username || "Someone"} added this on ${createdDateLabel}`}
            </p>

            <div className={styles.pillRow}>
              <span className={`${styles.pill} ${statusPillClass}`}>
                {item.status || "Needed"}
              </span>
              <span className={`${styles.pill} ${priorityPillClass}`}>
                {item.priority || "Medium"} priority
              </span>
              <span className={styles.pill}>{item.category || "Other"}</span>
            </div>
          </div>

          {isOwner && (
            <div className={styles.actions}>
              <Link to={`/items/${itemId}/edit`} className={styles.editBtn}>
                Edit
              </Link>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => handleDeleteItem(itemId)}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className={styles.hero}>
          {item.image_url ? (
            <img src={item.image_url} alt={item.item_name} className={styles.image} />
          ) : (
            <div className={styles.infoSection}>
              <p className={styles.description} style={{ margin: 0 }}>
                No image added yet.
              </p>
            </div>
          )}

          <p className={styles.description}>{item.description}</p>
        </div>

        <section className={styles.infoSection}>
          <h2 className={styles.infoTitle}>Item Details</h2>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Quantity</span>
              <span className={styles.value}>{item.quantity ?? 1}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Price</span>
              <span className={styles.value}>{priceLabel}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Store</span>
              <span className={styles.value}>{item.store?.trim() ? item.store : "—"}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Product Link</span>
              <span className={styles.value}>
                {safeLink ? (
                  <a className={styles.link} href={safeLink} target="_blank" rel="noreferrer">
                    Open
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>

            <div className={styles.infoItem} style={{ gridColumn: "1 / -1" }}>
              <span className={styles.label}>Notes</span>
              <span className={styles.value}>{item.notes?.trim() ? item.notes : "—"}</span>
            </div>
          </div>
        </section>

        <section className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Comments</h2>

          {/* assumes CommentForm is now styled with CommentForm.module.css */}
          <CommentForm handleAddComment={handleAddComment} />

          {!item.comments || item.comments.length === 0 ? (
            <p className={styles.meta}>No comments yet.</p>
          ) : (
            item.comments.map((comment) => (
              <div key={comment.comment_id} className={styles.commentCard}>
                <div className={styles.commentMeta}>
                  {`${comment.comment_author_username} • ${
                    comment.comment_created_at
                      ? new Date(comment.comment_created_at).toLocaleDateString()
                      : "Unknown date"
                  }`}
                </div>
                <div>{comment.comment_text}</div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
};

export default RegistryDetails;





