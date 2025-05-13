// pages/products.tsx
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQty: number;
  categoryId?: string;
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
  const [editingId, setEditingId] = useState<string | null>(null);

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
    if (editingId) {
      // Update
      await api.patch(`/products/${editingId}`, {
        name: form.name,
        sku: form.sku,
        price: parseFloat(form.price),
        stockQty: parseInt(form.stockQty),
        categoryId: form.categoryId,
      });
      setEditingId(null);
    } else {
      // Create
      await api.post("/products", {
        name: form.name,
        sku: form.sku,
        price: parseFloat(form.price),
        stockQty: parseInt(form.stockQty),
        categoryId: form.categoryId,
      });
    }

    setForm({ name: "", sku: "", price: "", stockQty: "", categoryId: "" });
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      stockQty: product.stockQty.toString(),
      categoryId: product.categoryId || "",
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {editingId ? "Edit Product" : "Add Product"}
      </h1>

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
        <div className="flex gap-2 col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded flex-1"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button
              type="button"
              className="bg-gray-400 text-white p-2 rounded"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", sku: "", price: "", stockQty: "", categoryId: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="border rounded p-4 shadow-sm flex justify-between items-center" data-testid="product-card"
          >
            <div>
              <div className="font-semibold" data-testid="product-name">{product.name}</div>
              <div className="text-sm text-gray-600" data-testid="product-sku">SKU: {product.sku}</div>
              <div className="text-sm text-gray-600" data-testid="product-stock">
                Price: ₹{product.price} | Stock: {product.stockQty}
              </div>
            </div>
            <div className="flex gap-2 items-center text-sm text-gray-500">
              <span>{new Date(product.createdAt).toLocaleString()}</span>
              <button
                onClick={() => handleEdit(product)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
