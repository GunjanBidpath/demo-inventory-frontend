// pages/products.tsx
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQty: number;
  createdAt: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stockQty: "",
    categoryId: "",
  });

  const fetchProducts = async () => {
    const res = await api.get<Product[]>("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/products", {
      name: form.name,
      sku: form.sku,
      price: parseFloat(form.price),
      stockQty: parseInt(form.stockQty),
      categoryId: form.categoryId,
    });
    setForm({ name: "", sku: "", price: "", stockQty: "", categoryId: "" });
    fetchProducts();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
        <input
          className="border p-2 rounded"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded"
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded"
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded"
          name="stockQty"
          placeholder="Stock Qty"
          type="number"
          value={form.stockQty}
          onChange={handleChange}
          required
        />
        <input
          className="border p-2 rounded col-span-2"
          name="categoryId"
          placeholder="Category ID"
          value={form.categoryId}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded col-span-2"
        >
          Add Product
        </button>
      </form>

      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="border rounded p-4 shadow-sm flex justify-between"
          >
            <div>
              <div className="font-semibold">{product.name}</div>
              <div className="text-sm text-gray-600">SKU: {product.sku}</div>
              <div className="text-sm text-gray-600">
                Price: ₹{product.price} | Stock: {product.stockQty}
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {new Date(product.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
