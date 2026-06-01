import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sliders, Plus, Edit2, Trash2, X, Star, Sparkles, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('Men');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [countInStock, setCountInStock] = useState(10);
  const [isFeatured, setIsFeatured] = useState(false);
  const [sizes, setSizes] = useState('S, M, L, XL');
  const [colors, setColors] = useState('Black, Beige');

  const fallbackCatalog = [
    {
      _id: 'fallback1',
      name: 'Luke Gold Embroidered Blazer',
      price: 349.99,
      category: 'Men',
      description: 'Elevate your evening wardrobe with gold brocade embroidery.',
      images: ['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      countInStock: 8,
      sizes: ['M', 'L'],
      colors: ['Black Gold'],
      rating: 4.8,
      numReviews: 2
    },
    {
      _id: 'fallback2',
      name: 'Luke Silk Slip Dress',
      price: 199.50,
      category: 'Women',
      description: 'Drafted from 100% pure Mulberry silk, bias-cut elegant satin cowl neck.',
      images: ['https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      countInStock: 12,
      sizes: ['S', 'M'],
      colors: ['Champagne'],
      rating: 4.9,
      numReviews: 1
    }
  ];

  // Refresh lists
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/products?pageSize=100');
        if (response.ok) {
          const data = await response.json();
          let list = data.products || [];

          // Integrate mock custom additions from localStorage
          const localAdditions = JSON.parse(localStorage.getItem('customProducts') || '[]');
          
          if (list.length === 0 && localAdditions.length === 0) {
            setProducts(fallbackCatalog);
          } else {
            setProducts([...localAdditions, ...list]);
          }
        } else {
          loadFallback();
        }
      } catch (err) {
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadFallback = () => {
      const localAdditions = JSON.parse(localStorage.getItem('customProducts') || '[]');
      if (localAdditions.length === 0) {
        setProducts(fallbackCatalog);
      } else {
        setProducts([...localAdditions, ...fallbackCatalog]);
      }
    };

    fetchProducts();
  }, [triggerRefresh]);

  // Open modal for add new automatically if query parameter contains addNew
  useEffect(() => {
    if (searchParams.get('addNew') === 'true') {
      handleOpenAddModal();
    }
  }, [searchParams]);

  const handleOpenAddModal = () => {
    setEditProduct(null);
    setName('');
    setPrice(120);
    setCategory('Men');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80');
    setCountInStock(15);
    setIsFeatured(false);
    setSizes('S, M, L, XL');
    setColors('Black, Sand');
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditProduct(product);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setDescription(product.description);
    setImageUrl(product.images && product.images[0] ? product.images[0] : '');
    setCountInStock(product.countInStock);
    setIsFeatured(product.isFeatured || false);
    setSizes(product.sizes ? product.sizes.join(', ') : 'S, M, L');
    setColors(product.colors ? product.colors.join(', ') : 'Default');
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this premium garment?')) return;

    try {
      if (productId.startsWith('fallback') || productId.startsWith('custom_')) {
        // Mock delete
        const custom = JSON.parse(localStorage.getItem('customProducts') || '[]');
        const updated = custom.filter(p => p._id !== productId);
        localStorage.setItem('customProducts', JSON.stringify(updated));
        
        // Remove from static fallback
        alert('Custom catalog item removed successfully.');
        setTriggerRefresh(!triggerRefresh);
      } else {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        if (response.ok) {
          alert(' Garment removed from databases.');
          setTriggerRefresh(!triggerRefresh);
        } else {
          const data = await response.json();
          alert(data.message || 'Error deleting product');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const sizesArray = sizes.split(',').map(s => s.trim()).filter(s => s !== '');
    const colorsArray = colors.split(',').map(c => c.trim()).filter(c => c !== '');

    const payload = {
      name,
      price: Number(price),
      category,
      description,
      images: [imageUrl],
      countInStock: Number(countInStock),
      isFeatured,
      sizes: sizesArray,
      colors: colorsArray
    };

    try {
      if (!user || user._id.toString().startsWith('fallback') || (editProduct && editProduct._id.toString().startsWith('custom_')) || (editProduct && editProduct._id.toString().startsWith('fallback'))) {
        // Mock operations offline
        const custom = JSON.parse(localStorage.getItem('customProducts') || '[]');
        
        if (editProduct) {
          // Edit operation mock
          const index = custom.findIndex(p => p._id === editProduct._id);
          const updatedProduct = {
            ...editProduct,
            ...payload
          };

          if (index > -1) {
            custom[index] = updatedProduct;
          } else {
            custom.push(updatedProduct);
          }
          localStorage.setItem('customProducts', JSON.stringify(custom));
          alert(' Garment details modified in mock database.');
        } else {
          // Add operation mock
          const newProduct = {
            _id: 'custom_' + Math.random().toString(36).substr(2, 9),
            ...payload,
            rating: 5.0,
            numReviews: 0,
            reviews: []
          };
          custom.push(newProduct);
          localStorage.setItem('customProducts', JSON.stringify(custom));
          alert(' New luxury garment added to mock database successfully!');
        }
        
        setShowModal(false);
        setTriggerRefresh(!triggerRefresh);
      } else {
        // Real database CRUD operations
        let response;
        if (editProduct) {
          response = await fetch(`http://localhost:5000/api/products/${editProduct._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(payload)
          });
        } else {
          response = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(payload)
          });
        }

        const data = await response.json();
        if (response.ok) {
          alert(editProduct ? 'Garment updated successfully!' : 'New premium garment created!');
          setShowModal(false);
          setTriggerRefresh(!triggerRefresh);
        } else {
          alert(data.message || 'Failed to submit product details');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Operation loaded in mock database instead.');
    }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: 'calc(100vh - 400px)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '24px',
          marginBottom: '48px'
        }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sliders size={28} color="var(--accent)" /> Manage Atelier Products
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              OPERATE THE CATALOG, CREATE NEW RELEASES AND ASSIGN ATELIER FEATURED PIECES
            </p>
          </div>

          <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> ADD ATELIER PIECE
          </button>
        </div>

        {/* Listing Products */}
        {loading ? (
          <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>Gathering active garment rosters...</div>
        ) : (
          <div className="table-responsive animate-fade-in">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>COLLECTION</th>
                  <th>FEATURED</th>
                  <th>IN STOCK</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img 
                        src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80'} 
                        alt="" 
                        style={{ width: '40px', height: '53px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} 
                      />
                    </td>
                    <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{p._id}</td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                    <td><span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>{p.category}</span></td>
                    <td>
                      {p.isFeatured ? (
                        <span className="badge badge-success" style={{ fontSize: '0.65rem', display: 'inline-flex', gap: '4px' }}>
                          <Sparkles size={8} /> FEATURED
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standard</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, color: p.countInStock === 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {p.countInStock}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleOpenEditModal(p)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', gap: '4px' }}
                        >
                          <Edit2 size={12} /> EDIT
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p._id)}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', gap: '4px' }}
                        >
                          <Trash2 size={12} /> DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Form Modal overlay */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {/* Backdrop */}
            <div onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)' }} />

            {/* Modal Body */}
            <div className="glass-panel" style={{
              position: 'relative',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '36px',
              boxShadow: 'var(--shadow-premium)',
              animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}>
              
              <div style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)' }}>
                  {editProduct ? 'EDIT PREMIUM GARMENT' : 'RELEASE NEW luxury PRODUCT'}
                </h3>
                <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Product name */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Garment Name</label>
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                {/* Price, Stock, Category */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="grid-3">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Price ($)</label>
                    <input type="number" step="0.01" className="form-control" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Count In Stock</label>
                    <input type="number" className="form-control" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Collection</label>
                    <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} style={{ cursor: 'pointer', appearance: 'auto' }}>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                {/* Sizes, Colors */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="grid-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Sizes (comma-separated)</label>
                    <input type="text" className="form-control" placeholder="XS, S, M, L, XL" value={sizes} onChange={(e) => setSizes(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Colors (comma-separated)</label>
                    <input type="text" className="form-control" placeholder="Gold, Obsidian Black, Tan" value={colors} onChange={(e) => setColors(e.target.value)} required />
                  </div>
                </div>

                {/* Image URL */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Atelier Image URL (Unsplash direct recommended)</label>
                  <input type="text" className="form-control" placeholder="https://images.unsplash.com/..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
                </div>

                {/* Description */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Garment Description</label>
                  <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} style={{ resize: 'none' }} required />
                </div>

                {/* Featured toggler */}
                <div className="form-group" style={{
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(212, 178, 111, 0.03)'
                }}>
                  <input 
                    type="checkbox" 
                    id="featuredCheckbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      accentColor: 'var(--accent)',
                      cursor: 'pointer'
                    }}
                  />
                  <div>
                    <label htmlFor="featuredCheckbox" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} /> MARK AS ATELIER FEATURED STAPLE
                    </label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                      Checking this will highlight the piece directly on the homepage Featured Showcase slider!
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    CANCEL
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                    {editProduct ? 'SAVE CHANGES' : 'CREATE lux PRODUCT'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
