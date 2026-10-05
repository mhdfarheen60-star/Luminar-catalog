const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const BASE = `${API_URL}/products`;

async function request(url, options) {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  return res.status === 204 ? null : res.json();
}

const json = (method, body) => ({
  method,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

export const getProducts = () => request(BASE);

export const getProduct = (id) => request(`${BASE}/${id}`);

export const addProduct = (data) =>
  request(BASE, json("POST", data));

export const updateProduct = (id, data) =>
  request(`${BASE}/${id}`, json("PUT", data));

export const deleteProduct = (id) =>
  request(`${BASE}/${id}`, {
    method: "DELETE",
  });