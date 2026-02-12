// src/services/hootService.js
// Baby Registry frontend service (still named hootService for now)

const SERVER_URL = import.meta.env.VITE_BACK_END_SERVER_URL;
const BASE_URL = `${SERVER_URL}/items`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// GET ALL ITEMS
const index = async () => {
  try {
    const res = await fetch(BASE_URL, { headers: authHeaders() });
    const data = await res.json();

    if (!res.ok) throw new Error(data?.error || "Failed to load items");
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

// GET ONE ITEM
const show = async (itemId) => {
  try {
    const res = await fetch(`${BASE_URL}/${itemId}`, { headers: authHeaders() });
    const data = await res.json();

    if (!res.ok) throw new Error(data?.error || "Failed to load item");
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// CREATE ITEM (FormData)
const create = async (itemFormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: authHeaders(), // don't set Content-Type with FormData
      body: itemFormData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to create item");
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// UPDATE ITEM (FormData)
const updateHoot = async (itemId, itemFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${itemId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: itemFormData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to update item");
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// DELETE ITEM
const deleteHoot = async (itemId) => {
  try {
    const res = await fetch(`${BASE_URL}/${itemId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to delete item");
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { index, show, create, updateHoot, deleteHoot };


