import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addProduct, getProduct, getProducts, updateProduct } from "../api.js";

const empty = { name: "", price: "", category: "" };

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  useEffect(() => {
    getProducts()
      .then((products) => {
        const cats = [...new Set(products.map((p) => p.category))].sort();
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) {
      setForm(empty);
      setShowCustomCategory(false);
      return;
    }
    getProduct(id)
      .then(({ name, price, category }) => {
        setForm({ name, price, category });
        if (!categories.includes(category)) {
          setCategories((prev) => [...prev, category].sort());
        }
      })
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "__custom__") {
      setShowCustomCategory(true);
      setForm({ ...form, category: "" });
    } else {
      setShowCustomCategory(false);
      setForm({ ...form, category: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
    };
    if (!data.name || !data.category || !(data.price >= 0) || form.price === "") {
      setError("Fill in all fields with a valid price.");
      return;
    }
    try {
      if (isEdit) {
        await updateProduct(id, data);
        setSuccess(`Product "${data.name}" updated`);
      } else {
        await addProduct(data);
        setSuccess(`Product "${data.name}" added`);
      }
      setTimeout(() => navigate("/products"), 1500);
    } catch {
      setError("Could not save the product. Try again.");
    }
  };

  if (loading) return <p className="note">Loading product…</p>;

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Edit product" : "Add product"}</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} />
      </label>
      <label>
        Price (₹)
        <input name="price" type="number" min="0" value={form.price} onChange={handleChange} />
      </label>
      <label>
        Category
        <select name="category" value={form.category} onChange={handleCategoryChange} disabled={showCustomCategory}>
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          <option value="__custom__">+ Add new category…</option>
        </select>
        {showCustomCategory && (
          <input
            name="category"
            type="text"
            placeholder="Enter new category"
            value={form.category}
            onChange={handleChange}
            autoFocus
          />
        )}
      </label>
      <div className="actions">
        <button className="btn primary" type="submit">
          {isEdit ? "Save changes" : "Add product"}
        </button>
        <button className="btn" type="button" onClick={() => navigate("/products")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
