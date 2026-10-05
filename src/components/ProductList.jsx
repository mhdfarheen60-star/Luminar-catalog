import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getProducts } from "../api.js";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products. Is JSON Server running on port 3001?"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch {
      setError("Could not delete the product. Try again.");
    }
  };

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <>
      <section className="hero">
        <h2></h2>
        <span className="hero-band"> Luminar Catalog</span>
      </section>

      <div className="catalog-wrap">
        {loading && <p className="note">Loading products…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && products.length === 0 && !error && (
          <p className="note">
            No products yet. <Link to="/add-product">Add your first product</Link>.
          </p>
        )}

        <div className="catalog">
          {products.map((p) => (
            <article className="card" key={p.id}>
              <div className="card-media">
                {p.image ? (
                  <img src={p.image} alt={p.name} />
                ) : (
                  <span className="placeholder">{p.name.charAt(0).toUpperCase()}</span>
                )}
                <span className="price">₹{Number(p.price).toLocaleString("en-IN")}</span>
              </div>
              <h3>{p.name}</h3>
              <p className="card-sub">{p.description || p.category}</p>
              <div className="actions">
                <Link className="btn" to={`/edit-product/${p.id}`}>Edit</Link>
                <button className="btn danger" onClick={() => handleDelete(p)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section className="band">
        <div className="band-inner">
          <div>
            <h3>What we sell here</h3>
            <ul>
              {categories.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
          <Link className="btn" to="/add-product">Add product</Link>
        </div>
      </section>
    </>
  );
}