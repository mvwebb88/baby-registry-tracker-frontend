import { Link } from "react-router-dom";

const HootList = ({ hoots = [] }) => {
  // "hoots" prop name is kept for now, but these are ITEMS from /items
  if (!Array.isArray(hoots) || hoots.length === 0) {
    return <p>No items yet.</p>;
  }

  return (
    <main>
      <h1>Registry Items</h1>

      {hoots.map((item) => (
        <article key={item.id} style={{ marginBottom: "18px" }}>
          <Link to={`/items/${item.id}`}>

            <h2>{item.item_name}</h2>
          </Link>

          <p>
            Added by {item.owner_username || "Unknown"} on{" "}
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : "Unknown date"}
          </p>

          <p>{item.description}</p>

          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.item_name}
              style={{ maxWidth: "240px", display: "block", marginTop: "10px" }}
            />
          )}
        </article>
      ))}
    </main>
  );
};

export default HootList;



