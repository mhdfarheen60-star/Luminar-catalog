import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="home">
      <span className="home-rule" aria-hidden="true" />
      <h1>Luminar Catalog</h1>
      <p>Browse, add and manage your products in one place.</p>
      <Link className="btn primary home-btn" to="/products">
        View products
      </Link>
    </section>
  );
}