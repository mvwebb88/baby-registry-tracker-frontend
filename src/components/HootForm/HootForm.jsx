// src/components/HootForm/HootForm.jsx
// NOTE: We’re keeping the component name "HootForm" for now,
// but it is used to create/update baby registry ITEMS.

import { useState, useEffect } from "react";
import { useParams } from "react-router";

import * as hootService from "../../services/hootService";

const HootForm = ({ handleAddHoot, handleUpdateHoot }) => {
  const { hootId } = useParams();

  // Backend expects: item_name, description, due_date, image_url (string URL)
  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    due_date: "", // keep as string "YYYY-MM-DD" or ""
    image_url: "", // URL string (not a File yet)
  });

  // Keep file state for later Cloudinary upload wiring
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!hootId) return;

      const itemData = await hootService.show(hootId);
      if (!itemData) return;

      setFormData({
        item_name: itemData.item_name || "",
        description: itemData.description || "",
        // backend returns due_date possibly as null; convert to ""
        due_date: itemData.due_date || "",
        image_url: itemData.image_url || "",
      });
    };

    fetchItem();
  }, [hootId]);

  const handleChange = (evt) => {
    setFormData((prev) => ({ ...prev, [evt.target.name]: evt.target.value }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const data = new FormData();

    // Required fields
    data.append("item_name", formData.item_name);
    data.append("description", formData.description);

    // Optional fields
    if (formData.due_date) data.append("due_date", formData.due_date);

    // IMPORTANT:
    // Your backend currently expects image_url as a TEXT field (a URL string).
    // It does NOT read request.files yet.
    // So for now, we only send image_url as a string (or leave it blank).
    if (formData.image_url) data.append("image_url", formData.image_url);

    // We are not uploading imageFile yet. We'll add Cloudinary upload next.
    // Keeping this here so you can see it’s captured:
    // if (imageFile) { ... }  <-- later

    if (hootId) {
      handleUpdateHoot(hootId, data);
    } else {
      handleAddHoot(data);
    }
  };

  return (
    <main>
      <h1>{hootId ? "Edit Registry Item" : "New Registry Item"}</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="item_name-input">Item Name</label>
        <input
          required
          type="text"
          name="item_name"
          id="item_name-input"
          value={formData.item_name}
          onChange={handleChange}
        />

        <label htmlFor="description-input">Description</label>
        <textarea
          required
          name="description"
          id="description-input"
          value={formData.description}
          onChange={handleChange}
        />

        <label htmlFor="due_date-input">Due Date (optional)</label>
        <input
          type="date"
          name="due_date"
          id="due_date-input"
          value={formData.due_date || ""}
          onChange={handleChange}
        />

        <label htmlFor="image_url-input">Image URL (optional)</label>
        <input
          type="url"
          name="image_url"
          id="image_url-input"
          placeholder="https://..."
          value={formData.image_url}
          onChange={handleChange}
        />

        {/* Keep file input for the future Cloudinary step */}
        <label htmlFor="image_file-input">Upload Image (later)</label>
        <input
          type="file"
          id="image_file-input"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        {/* Preview if editing and an image_url exists */}
        {hootId && formData.image_url && (
          <div>
            <p>Current image:</p>
            <img
              src={formData.image_url}
              alt="Current item"
              style={{ maxWidth: "200px" }}
            />
          </div>
        )}

        <button type="submit">SUBMIT</button>
      </form>
    </main>
  );
};

export default HootForm;

