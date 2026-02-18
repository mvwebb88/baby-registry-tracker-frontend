import { Link } from "react-router-dom";
import styles from "./RegistryList.module.css";

const RegistryList = ({ items = [] }) => {
  const hasItems = Array.isArray(items) && items.length > 0;

  if (!hasItems) {
    return (
      <main className={styles.container}>
        <h1 className={styles.title}>Registry Items</h1>
        <p className={styles.empty}>No items yet.</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Registry Items</h1>

      <div className={styles.grid}>
        {items.map((item) => {
          const title = item.item_name || item.name || "Untitled item";
          const store = item.store?.trim() ? item.store : "No store";
          const category = item.category?.trim() ? item.category : "Other";
          const status = item.status || "Needed";

          const priceNumber =
            item.price === null || item.price === undefined || item.price === ""
              ? null
              : Number(item.price);

          const priceLabel =
            priceNumber !== null && !Number.isNaN(priceNumber)
              ? `$${priceNumber.toFixed(2)}`
              : "";

          const badgeClass =
            status === "Purchased"
              ? `${styles.badge} ${styles.purchased}`
              : `${styles.badge} ${styles.needed}`;

          return (
            <Link to={`/items/${item.id}`} key={item.id} className={styles.card}>
              {item.image_url ? (
                <div className={styles.imageWrapper}>
                  <img
                    src={item.image_url}
                    alt={title}
                    className={styles.image}
                    loading="lazy"
                  />
                </div>
              ) : null}

              <h2 className={styles.cardTitle}>{title}</h2>

              <p className={styles.cardMeta}>
                {category} • {store}
              </p>

              {priceLabel ? <p className={styles.cardPrice}>{priceLabel}</p> : null}

              <span className={badgeClass}>{status}</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
};

export default RegistryList;








