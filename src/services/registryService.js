// src/services/registryService.js

const SERVER_URL = import.meta.env.VITE_BACK_END_SERVER_URL;
const BASE_URL = `${SERVER_URL}/items`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Helper: parse JSON safely
const parseJSON = async (res) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "Invalid JSON response" };
  }
};

// GET ALL ITEMS
const index = async () => {
  const res = await fetch(BASE_URL, { headers: authHeaders() });
  const data = await parseJSON(res);
  if (!res.ok) throw new Error(data?.error || "Failed to load items");
  return data;
};

// GET ONE ITEM
const show = async (itemId) => {
  const res = await fetch(`${BASE_URL}/${itemId}`, { headers: authHeaders() });
  const data = await parseJSON(res);
  if (!res.ok) throw new Error(data?.error || "Failed to load item");
  return data;
};

// CREATE ITEM (FormData)
const create = async (itemFormData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(), // don't set Content-Type with FormData
    body: itemFormData,
  });

  const data = await parseJSON(res);
  if (!res.ok) throw new Error(data?.error || "Failed to create item");
  return data;
};

// UPDATE ITEM (FormData)
const update = async (itemId, itemFormData) => {
  const res = await fetch(`${BASE_URL}/${itemId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: itemFormData,
  });

  const data = await parseJSON(res);
  if (!res.ok) throw new Error(data?.error || "Failed to update item");
  return data;
};

// DELETE ITEM
const remove = async (itemId) => {
  const res = await fetch(`${BASE_URL}/${itemId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await parseJSON(res);
  if (!res.ok) throw new Error(data?.error || "Failed to delete item");
  return data;
};

// ✅ CREATE COMMENT (JSON)
const createComment = async (itemId, commentFormData) => {
  // commentFormData can be { comment_text: "..." } or { text: "..." }
  const res = await fetch(`${BASE_URL}/${itemId}/comments`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentFormData),
  });

  const data = await parseJSON(res);
  if (!res.ok) throw new Error(data?.error || "Failed to create comment");
  return data;
};

export { index, show, create, update, remove, createComment };





