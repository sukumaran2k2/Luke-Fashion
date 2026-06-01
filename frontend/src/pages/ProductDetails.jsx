import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, RefreshCw, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selection states
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Fallback DB reference for offline mock functionality
  const fallbackCatalog = [
    {
      _id: 'fallback1',
      name: 'Luke Gold Embroidered Blazer',
      price: 349.99,
      category: 'Men',
      description: 'Elevate your evening wardrobe with the Luke Gold Embroidered Blazer. Tailored from a premium wool-blend fabrication, it features meticulous hand-stitched gold brocade embroidery on the lapels, double-vented back, and a structured Italian silhouette. Designed to make an unforgettable entrance.',
      images: [
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
      ],
      isFeatured: true,
      rating: 4.8,
      numReviews: 4,
      sizes: ['M', 'L', 'XL'],
      colors: ['Black Gold', 'Navy Gold'],
      countInStock: 8,
      reviews: [
        { _id: 'r1', name: 'Arthur Pendragon', rating: 5, comment: 'Absolutely sensational. Fits perfectly and the embroidery is flawless.', createdAt: '2026-05-15T10:00:00Z' },
        { _id: 'r2', name: 'Victor V.', rating: 4, comment: 'Gorgeous blazer. Wore it to a gala and got tons of compliments.', createdAt: '2026-05-20T10:00:00Z' }
      ]
    },
    {
      _id: 'fallback2',
      name: 'Luke Silk Slip Dress',
      price: 199.50,
      category: 'Women',
      description: 'Drafted from 100% pure Mulberry silk, this cowl-neck slip dress floats gracefully around the body. Features adjustable delicate cross-back spaghetti straps, a soft bias-cut hemline that pools elegantly, and a luxurious satin finish. A timeless piece for romantic dinners.',
      images: [
        'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
      ],
      isFeatured: true,
      rating: 4.9,
      numReviews: 2,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Emerald Green', 'Champagne', 'Midnight Black'],
      countInStock: 12,
      reviews: [
        { _id: 'r3', name: 'Isabella R.', rating: 5, comment: 'The silk feels incredibly soft and high quality. The bias cut is very flattering!', createdAt: '2026-05-18T10:00:00Z' }
      ]
    },
    {
      _id: 'fallback3',
      name: 'Luke Minimalist Leather Chelsea Boots',
      price: 240.00,
      category: 'Men',
      description: 'Crafted in Tuscany from full-grain calfskin leather, these boots offer a sleek, hardware-free profile. Fully leather-lined with a durable, water-resistant Dainite rubber sole, elasticated side panels, and woven pull tabs. A beautiful bridge between casual refinement and formal wear.',
      images: [
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
      ],
      isFeatured: true,
      rating: 4.7,
      numReviews: 1,
      sizes: ['8', '9', '10', '11'],
      colors: ['Cognac Tan', 'Obsidian Black'],
      countInStock: 15,
      reviews: [
        { _id: 'r4', name: 'Liam Nees', rating: 5, comment: 'Best Chelsea boots I have owned. Break-in period was minimal, leather is beautiful.', createdAt: '2026-05-12T10:00:00Z' }
      ]
    },
    {
      _id: 'fallback4',
      name: 'Luke Classic Leather Trench Coat',
      price: 499.99,
      category: 'Women',
      description: 'An architectural reinterpretation of the iconic military trench. Tailored in structured nappa leather that softens beautifully over time. Detailed with double-breasted closure, waist-cinching belt, shoulder epaulets, storm flaps, and standard deep utility pockets.',
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
      ],
      isFeatured: true,
      rating: 5.0,
      numReviews: 3,
      sizes: ['S', 'M', 'L'],
      colors: ['Vintage Tan', 'Carbon Black'],
      countInStock: 5,
      reviews: [
        { _id: 'r5', name: 'Diana Prince', rating: 5, comment: 'Stunning leather trench! Feels empowering and fits like a glove.', createdAt: '2026-05-22T10:00:00Z' }
      ]
    },
    {
      _id: 'fallback5',
      name: 'Luke Oversized Cashmere Hoodie',
      price: 180.00,
      category: 'Unisex',
      description: 'Knit from Mongolian cashmere, dropping shoulders and double ribbed cuffs. Comfortable luxury wear.',
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80'],
      isFeatured: false,
      rating: 4.6,
      numReviews: 0,
      sizes: ['S', 'M', 'L'],
      colors: ['Heather Gray', 'Oatmeal Beige'],
      countInStock: 20,
      reviews: []
    },
    {
      _id: 'fallback6',
      name: 'Luke Tailored Linen Trouser',
      price: 110.00,
      category: 'Women',
      description: 'Pure organic flax linen. Deep pockets, pleated waistband, tailored aesthetic.',
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'],
      isFeatured: false,
      rating: 4.5,
      numReviews: 0,
      sizes: ['XS', 'S', 'M'],
      colors: ['Pure White', 'Sand Beige'],
      countInStock: 10,
      reviews: []
    },
    {
      _id: 'fallback7',
      name: 'Luke Knit Wool Scarf',
      price: 65.00,
      category: 'Accessories',
      description: 'Oversized heavy rib scarf knit in extrafine Merino wool. Extremely warm and textured.',
      images: ['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80'],
      isFeatured: false,
      rating: 4.8,
      numReviews: 0,
      sizes: ['One Size'],
      colors: ['Forest Green', 'Burnt Orange'],
      countInStock: 30,
      reviews: []
    },
    {
      _id: 'fallback8',
      name: 'Luke Aviator Sunglasses',
      price: 135.00,
      category: 'Accessories',
      description: 'Structured high grade titanium aviator frames featuring polarized custom green tints.',
      images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'],
      isFeatured: false,
      rating: 4.9,
      numReviews: 0,
      sizes: ['One Size'],
      colors: ['Gold / Green Lens'],
      countInStock: 25,
      reviews: []
    }
  ];

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          initializeSelections(data);
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
      const found = fallbackCatalog.find((x) => x._id === id);
      if (found) {
        setProduct(found);
        initializeSelections(found);
      } else {
        // If not found in static, use the first one as default
        setProduct(fallbackCatalog[0]);
        initializeSelections(fallbackCatalog[0]);
      }
    };

    const initializeSelections = (data) => {
      if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
      if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
    };

    fetchProductDetails();
  }, [id, reviewSuccess]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty, selectedSize, selectedColor);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setReviewLoading(true);
    try {
      if (id.startsWith('fallback')) {
        // Mock success for fallbacks
        const newReview = {
          _id: 'r_mock_' + Math.random(),
          name: user ? user.name : 'Jane Guest',
          rating: Number(rating),
          comment,
          createdAt: new Date().toISOString()
        };
        const updatedReviews = [newReview, ...product.reviews];
        const updatedRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
        
        setProduct({
          ...product,
          reviews: updatedReviews,
          rating: updatedRating,
          numReviews: updatedReviews.length
        });
        setComment('');
        setReviewSuccess(true);
      } else {
        const response = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({ rating, comment })
        });
        const data = await response.json();
        if (response.ok) {
          setComment('');
          setReviewSuccess(!reviewSuccess);
        } else {
          alert(data.message || 'Failed to submit review');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>Fusing luxury item details...</div>;
  }

  if (error || !product) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Product details offline. <Link to="/shop">Return to Shop</Link></div>;
  }

  const mainImage = product.images && product.images[selectedImage] ? product.images[selectedImage] : 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80';

  return (
    <div style={{ padding: '60px 0' }} className="animate-fade-in">
      <div className="container">
        
        {/* Back Link */}
        <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> RETURN TO ATELIER CATALOG
        </Link>

        {/* Multi Split Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '64px', marginBottom: '80px' }} className="grid-2">
          
          {/* Left Column: Image Gallery Viewer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '100%',
              aspectRatio: '3/4',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)'
            }}>
              <img 
                src={mainImage} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnails row */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '16px' }}>
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '80px',
                      aspectRatio: '3/4',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImage === idx ? '2px solid var(--accent)' : '1px solid var(--border-light)',
                      cursor: 'pointer',
                      opacity: selectedImage === idx ? 1 : 0.6,
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Buying controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Tag line details */}
            <div>
              <span className="badge badge-accent" style={{ marginBottom: '12px' }}>{product.category} Staple</span>
              <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', lineHeight: '1.2', marginBottom: '12px', fontWeight: 500 }}>
                {product.name}
              </h1>
              
              {/* Star details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', color: '#ffb300' }}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={14} 
                      fill={idx < Math.round(product.rating || 0) ? '#ffb300' : 'none'} 
                      stroke={idx < Math.round(product.rating || 0) ? '#ffb300' : 'var(--text-muted)'} 
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {product.rating.toFixed(1)} / 5.0 ({product.numReviews} Reviews)
                </span>
              </div>
            </div>

            {/* Price display */}
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent)', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
              ${product.price.toFixed(2)}
            </div>

            {/* Product description */}
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {product.description}
            </p>

            {/* Sizes selector lists */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="form-label" style={{ marginBottom: '12px' }}>Select Size</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {product.sizes.map((s) => (
                    <button 
                      key={s} 
                      onClick={() => setSelectedSize(s)}
                      style={{
                        padding: '10px 18px',
                        border: selectedSize === s ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                        backgroundColor: selectedSize === s ? 'var(--accent-light)' : 'transparent',
                        color: selectedSize === s ? 'var(--accent)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'var(--transition-smooth)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors selector lists */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="form-label" style={{ marginBottom: '12px' }}>Select Color</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {product.colors.map((c) => (
                    <button 
                      key={c} 
                      onClick={() => setSelectedColor(c)}
                      style={{
                        padding: '8px 16px',
                        border: selectedColor === c ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                        backgroundColor: selectedColor === c ? 'var(--accent-light)' : 'transparent',
                        color: selectedColor === c ? 'var(--accent)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity select, Add button */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '28px' }}>
              
              {/* Quantity Select wrapper */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                height: '48px'
              }}>
                <button 
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  style={{ padding: '0 16px', color: 'var(--text-secondary)', cursor: 'pointer', height: '100%' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 10px', fontSize: '0.95rem', fontWeight: 600 }}>
                  {qty}
                </span>
                <button 
                  onClick={() => qty < product.countInStock && setQty(qty + 1)}
                  style={{ padding: '0 16px', color: 'var(--text-secondary)', cursor: 'pointer', height: '100%' }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Bag CTA */}
              {product.countInStock > 0 ? (
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-primary"
                  style={{ flexGrow: 1, height: '48px', display: 'flex', gap: '10px' }}
                >
                  <ShoppingBag size={18} /> ADD TO ATELIER BAG
                </button>
              ) : (
                <button className="btn btn-secondary btn-block" style={{ height: '48px', cursor: 'not-allowed' }} disabled>
                  TEMPORARILY OUT OF STOCK
                </button>
              )}
            </div>

            {/* Quality indicators */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              borderTop: '1px solid var(--border-light)',
              paddingTop: '24px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }} className="grid-3">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} color="var(--accent)" /> Premium Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={16} color="var(--accent)" /> 30-Day Pickups
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--accent)" /> Carbon Neutral
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Customer Reviews list */}
        <section style={{ borderTop: '1px solid var(--border-light)', paddingTop: '60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '64px' }} className="grid-2">
            
            {/* Left Column: Post new review */}
            <div>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginBottom: '20px' }}>WRITE A REVIEW</h3>
              {user ? (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label className="form-label">Review Rating</label>
                    <select 
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        padding: '12px',
                        width: '100%',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="5">5 Stars - Extraordinary</option>
                      <option value="4">4 Stars - Excellent</option>
                      <option value="3">3 Stars - Good</option>
                      <option value="2">2 Stars - Fair</option>
                      <option value="1">1 Star - Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Customer Comment</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      placeholder="Share your experience with this premium garment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      style={{ resize: 'none' }}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                    {reviewLoading ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                  </button>
                </form>
              ) : (
                <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Please log in to share your custom atelier experience.</p>
                  <Link to="/login" className="btn btn-secondary btn-block">LOGIN TO REGISTER</Link>
                </div>
              )}
            </div>

            {/* Right Column: List of reviews */}
            <div>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginBottom: '24px' }}>
                CUSTOMER STAMPLES REVIEWS ({product.reviews.length})
              </h3>

              {product.reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                  No customer reviews have been shared for this piece yet. Be the first to leave one.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {product.reviews.map((r) => (
                    <div 
                      key={r._id || r.name} 
                      style={{
                        padding: '20px',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{r.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>

                      <div style={{ display: 'flex', color: '#ffb300', marginBottom: '10px' }}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            size={12} 
                            fill={idx < r.rating ? '#ffb300' : 'none'} 
                            stroke={idx < r.rating ? '#ffb300' : 'var(--text-muted)'} 
                          />
                        ))}
                      </div>

                      <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                        {r.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
