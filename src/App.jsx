import { Link, NavLink, Outlet, Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import ProductList from "./components/ProductList.jsx";
import ProductForm from "./components/ProductForm.jsx";

function Layout() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <h1><Link to="/" className="brand"> SHOP HERE</Link></h1>
          <nav>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/add-product">Add product</NavLink>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<Layout />}>
        <Route path="/products" element={<ProductList />} />
        <Route path="/add-product" element={<ProductForm />} />
        <Route path="/edit-product/:id" element={<ProductForm />} />
        <Route path="*" element={<p className="note">Page not found.</p>} />
      </Route>
    </Routes>
  );
}