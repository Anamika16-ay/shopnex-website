import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import { useToast } from '../../context/ToastContext';

const emptyForm = {
  id: '', categoryId: '', name: '', sku: '', brand: '', price: '', discountPercent: '0',
  stockQuantity: '0', status: 'active', description: '', specifications: '',
  isFeatured: false, isBestseller: false, isFlashSale: false,
};

export default function ManageProducts() {
  const { showToast } = useToast();
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProducts = () => api.get('/admin/products', { params: { search } }).then(({ data }) => setProducts(data.products));

  useEffect(() => { loadProducts(); }, [search]);
  useEffect(() => { api.get('/categories').then(({ data }) => setCategories(data.categories)); }, []);

  const openAddForm = () => { setForm(emptyForm); setImageFile(null); setPreview(''); setShowForm(true); };

  const openEditForm = (p) => {
    setForm({
      id: p._id, categoryId: p.category?._id || '', name: p.name, sku: p.sku, brand: p.brand || '',
      price: p.price, discountPercent: p.discountPercent, stockQuantity: p.stockQuantity, status: p.status,
      description: p.description || '', specifications: p.specifications || '',
      isFeatured: p.isFeatured, isBestseller: p.isBestseller, isFlashSale: p.isFlashSale,
    });
    setImageFile(null);
    setPreview(p.thumbnail);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => { if (key !== 'id') fd.append(key, val); });
      if (imageFile) fd.append('thumbnail', imageFile);

      if (form.id) {
        await api.put(`/admin/products/${form.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Product updated successfully.', 'success');
      } else {
        await api.post('/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Product added successfully.', 'success');
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not save product.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      showToast('Product deleted successfully.', 'success');
      loadProducts();
    } catch {
      showToast('Could not delete product.', 'danger');
    }
  };

  return (
    <AdminLayout title="Manage Products">
      {showForm ? (
        <div className="admin-table p-4">
          <h5 className="mb-4">{form.id ? 'Edit Product' : 'Add New Product'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Product Name *</label>
                <input type="text" className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label">SKU *</label>
                <input type="text" className="form-control" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Brand</label>
                <input type="text" className="form-control" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Category *</label>
                <select className="form-select" required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Price (₹) *</label>
                <input type="number" step="0.01" className="form-control" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Discount (%)</label>
                <input type="number" step="0.01" className="form-control" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Stock Qty</label>
                <input type="number" className="form-control" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {['active', 'inactive', 'draft'].map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea rows="3" className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
              </div>
              <div className="col-12">
                <label className="form-label">Specifications (one per line)</label>
                <textarea rows="3" className="form-control" value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })}></textarea>
              </div>

              <div className="col-md-6">
                <label className="form-label">Product Image {form.id ? '(leave empty to keep current)' : '*'}</label>
                <input type="file" className="form-control" accept="image/*" required={!form.id} onChange={handleImageChange} />
              </div>
              <div className="col-md-6 d-flex align-items-end">
                {preview && <img src={preview} className="admin-thumb" style={{ width: 70, height: 70 }} alt="Preview" />}
              </div>

              <div className="col-12 d-flex gap-4">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="isFeatured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                  <label className="form-check-label" htmlFor="isFeatured">Featured</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="isBestseller" checked={form.isBestseller} onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })} />
                  <label className="form-check-label" htmlFor="isBestseller">Best Seller</label>
                </div>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="isFlashSale" checked={form.isFlashSale} onChange={(e) => setForm({ ...form, isFlashSale: e.target.checked })} />
                  <label className="form-check-label" htmlFor="isFlashSale">Flash Sale</label>
                </div>
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary-brand px-4" disabled={saving}>
                {saving ? 'Saving...' : form.id ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" className="btn btn-outline-brand px-4" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <input type="text" className="form-control" style={{ maxWidth: 300 }} placeholder="Search by name or SKU"
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-primary-brand" onClick={openAddForm}><i className="fa-solid fa-plus me-2"></i>Add Product</button>
          </div>

          {!products ? <Loader /> : (
            <div className="admin-table">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td><img src={p.thumbnail} className="admin-thumb" alt="" /></td>
                        <td>{p.name}<div className="text-muted small">SKU: {p.sku}</div></td>
                        <td>{p.category?.name}</td>
                        <td>₹{p.price.toFixed(2)}</td>
                        <td>{p.stockQuantity}</td>
                        <td><span className={`status-pill status-${p.status}`}>{p.status}</span></td>
                        <td>
                          <button className="btn btn-sm btn-outline-brand me-1" onClick={() => openEditForm(p)}><i className="fa-solid fa-pen"></i></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}><i className="fa-solid fa-trash"></i></button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">No products found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
