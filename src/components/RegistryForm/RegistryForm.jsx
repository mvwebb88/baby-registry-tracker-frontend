// src/components/HootForm/HootForm.jsx
// NOTE: Keeping "HootForm" name for now, but this creates/updates baby registry ITEMS.

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import * as hootService from "../../services/registryService";

const HootForm = ({ handleAddHoot, handleUpdateHoot }) => {
  const { hootId } = useParams();

  // Backend expects: item_name, description, image_url (string URL)
  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
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

    // Optional: image_url (string URL)
    // Backend currently expects image_url as TEXT (URL), NOT an uploaded file.
    if (formData.image_url) data.append("image_url", formData.image_url);

    // We are not uploading imageFile yet. We'll wire Cloudinary next.
    // imageFile is captured but not sent.

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


