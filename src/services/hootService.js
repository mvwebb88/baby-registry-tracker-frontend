// src/services/hootService.js
// NOTE: This service now talks to /items (baby registry backend)

const SERVER_URL = import.meta.env.VITE_BACK_END_SERVER_URL;
const BASE_URL = `${SERVER_URL}/items`;

// Always include JWT token
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// --------------------
// GET ALL ITEMS
// --------------------
const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: authHeaders(),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to load items");

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

// --------------------
// GET ONE ITEM
// --------------------
const show = async (itemId) => {
  try {
    const res = await fetch(`${BASE_URL}/${itemId}`, {
      headers: authHeaders(),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to load item");

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// --------------------
// CREATE ITEM
// --------------------
const create = async (itemFormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: authHeaders(), // DO NOT set Content-Type when using FormData
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

// --------------------
// UPDATE ITEM
// --------------------
const updateHoot = async (itemId, itemFormData) =>

