import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import * as registryService from "../../services/registryService";
import styles from "./RegistryForm.module.css";

const RegistryForm = ({ handleAddItem, handleUpdateItem }) => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    quantity: 1,
    priority: "Medium",
    category: "Other",
    store: "",
    price: "",
    status: "Needed",
    link: "",
    image_url: "",
    notes: "",
  });

  // Fetch item for edit mode
  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!itemId) return;

        const itemData = await registryService.show(itemId);

        setFormData({
          item_name: itemData.item_name || "",
          description: itemData.description || "",
          quantity: itemData.quantity || 1,
          priority: itemData.priority || "Medium",
          category: itemData.category || "Other",
          store: itemData.store || "",
          price: itemData.price || "",
          status: itemData.status || "Needed",
          link: itemData.link || "",
          image_url: itemData.image_url || "",
          notes: itemData.notes || "",
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      if (itemId) {
        await handleUpdateItem(itemId, data);
      } else {
        await handleAddItem(data);
      }

      navigate("/items");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        {itemId ? "Edit Registry Item" : "Add Registry Item"}
      </h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Row 1 */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Item Name</label>
            <input
              required
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Quantity</label>
            <input
              type="number"
              min="1"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label>Description</label>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Row 2 */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option>Diapering</option>
              <option>Feeding</option>
              <option>Clothing</option>
              <option>Nursery</option>
              <option>Bath</option>
              <option>Travel</option>
              <option>Health & Safety</option>
              <option>Toys</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Store</label>
            <input
              type="text"
              name="store"
              value={formData.store}
              onChange={handleChange}
              placeholder="Target, Amazon, Walmart..."
            />
          </div>

          <div className={styles.field}>
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Status */}
        <div className={styles.field}>
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Needed</option>
            <option>Purchased</option>
          </select>
        </div>

        {/* Product Link */}
        <div className={styles.field}>
          <label>Product Link (optional)</label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        {/* Image URL */}
        <div className={styles.field}>
          <label>Image URL (optional)</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        {/* Notes */}
        <div className={styles.field}>
          <label>Notes (optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any extra notes..."
          />
        </div>

        {/* Buttons */}
        <div className={styles.buttonRow}>
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>

          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate("/items")}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
};

export default RegistryForm;






