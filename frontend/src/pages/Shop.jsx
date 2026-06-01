import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, RefreshCw, Search } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [categoryVal, setCategoryVal] = useState(searchParams.get('category') || '');
  const [maxPrice, setMaxPrice] = useState(600);
  const [sortBy, setSortBy] = useState('newest');

  // Static high-fidelity fallback catalogs
  const fallbackCatalog = [
    {
      _id: 'fallback1',
      name: 'Luke Gold Embroidered Blazer',
      price: 349.99,
      category: 'Men',
      description: 'Elevate your evening wardrobe with the Luke Gold Embroidered Blazer. Tailored from a premium wool-blend fabrication, it features meticulous hand-stitched gold brocade embroidery.',
      images: ['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      rating: 4.8,
      numReviews: 4,
      sizes: ['M', 'L', 'XL'],
      colors: ['Black Gold', 'Navy Gold'],
      countInStock: 8
    },
    {
      _id: 'fallback2',
      name: 'Luke Silk Slip Dress',
      price: 199.50,
      category: 'Women',
      description: 'Drafted from 100% pure Mulberry silk, this cowl-neck slip dress floats gracefully around the body.',
      images: ['https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      rating: 4.9,
      numReviews: 2,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Emerald Green', 'Champagne'],
      countInStock: 12
    },
    {
      _id: 'fallback3',
      name: 'Luke Minimalist Leather Chelsea Boots',
      price: 240.00,
      category: 'Men',
      description: 'Crafted in Tuscany from full-grain calfskin leather, these boots offer a sleek, hardware-free profile.',
      images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      rating: 4.7,
      numReviews: 1,
      sizes: ['8', '9', '10', '11'],
      colors: ['Cognac Tan', 'Obsidian Black'],
      countInStock: 15
    },
    {
      _id: 'fallback4',
      name: 'Luke Classic Leather Trench Coat',
      price: 499.99,
      category: 'Women',
      description: 'An architectural reinterpretation of the iconic military trench. Tailored in structured nappa leather.',
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      rating: 5.0,
      numReviews: 3,
      sizes: ['S', 'M', 'L'],
      colors: ['Vintage Tan', 'Carbon Black'],
      countInStock: 5
    },
    {
      _id: 'fallback5',
      name: 'Luke Oversized Cashmere Hoodie',
      price: 180.00,
      category: 'Unisex',
      description: 'Knit from thick, ultra-soft 12-gauge Mongolian cashmere, this unisex hoodie features a double-layered hood.',
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80'],
      isFeatured: false,
      rating: 4.6,
      numReviews: 2,
      sizes: ['S', 'M', 'L'],
      colors: ['Heather Gray', 'Oatmeal Beige'],
      countInStock: 20
    },
    {
      _id: 'fallback6',
      name: 'Luke Tailored Linen Trouser',
      price: 110.00,
      category: 'Women',
      description: 'Perfectly relaxed, lightweight trousers cut from Belgian organic flax linen.',
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'],
      isFeatured: false,
      rating: 4.5,
      numReviews: 1,
      sizes: ['S', 'M'],
      colors: ['Pure White', 'Sand Beige'],
      countInStock: 10
    },
    {
      _id: 'fallback7',
      name: 'Luke Knit Wool Scarf',
      price: 65.00,
      category: 'Accessories',
      description: 'A cozy, statement scarf knit from extra-fine Merino wool.',
      images: ['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80'],
      isFeatured: false,
      rating: 4.8,
      numReviews: 8,
      sizes: ['One Size'],
      colors: ['Forest Green', 'Burnt Orange'],
      countInStock: 30
    },
    {
      _id: 'fallback8',
      name: 'Luke Aviator Sunglasses',
      price: 135.00,
      category: 'Accessories',
      description: 'A structural take on the timeless aviator shape. Crafted from lightweight, high-grade titanium.',
      images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'],
      isFeatured: false,
      rating: 4.9,
      numReviews: 12,
      sizes: ['One Size'],
      colors: ['Gold / Green Lens'],
      countInStock: 25
    }
  ];

  // Update query parameters
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const cat = searchParams.get('category') || '';
    setSearchVal(search);
    setCategoryVal(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5000/api/products?pageSize=100';
        if (categoryVal) url += `&category=${categoryVal}`;
        if (searchVal) url += `&keyword=${encodeURIComponent(searchVal)}`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          let filtered = data.products || [];

          // If backend offline or empty, use fallback
          if (filtered.length === 0 && !searchVal && !categoryVal) {
            filtered = fallbackCatalog;
          }

          // Apply client price filtering
          filtered = filtered.filter(p => p.price <= maxPrice);

          // Apply client sorting
          if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
          } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
          } else if (sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
          }

          setProducts(filtered);
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
      let filtered = [...fallbackCatalog];
      if (categoryVal) {
        filtered = filtered.filter(p => p.category.toLowerCase() === categoryVal.toLowerCase());
      }
      if (searchVal) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchVal.toLowerCase()));
      }
      filtered = filtered.filter(p => p.price <= maxPrice);

      if (sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      setProducts(filtered);
    };

    fetchProducts();
  }, [categoryVal, searchVal, maxPrice, sortBy]);

  const handleCategorySelect = (categoryName) => {
    if (categoryVal === categoryName) {
      setCategoryVal('');
      setSearchParams({});
    } else {
      setCategoryVal(categoryName);
      setSearchParams({ category: categoryName });
    }
  };

  const handleClearFilters = () => {
    setSearchVal('');
    setCategoryVal('');
    setMaxPrice(600);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div style={{ padding: '60px 0', minHeight: 'calc(100vh - 400px)' }}>
      <div className="container">
        
        {/* Header Title */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>
            {categoryVal ? `${categoryVal.toUpperCase()} COLLECTION` : 'ATELIER SHOP'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            DISCOVER STAPLES BLENDING ITALIAN LINEAGE AND SUSTAINABLE FINISHES
          </p>
        </div>

        {/* Outer Split Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '48px' }} className="grid-2">
          
          {/* Left Filters column */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="filter-sidebar">
            
            {/* Filter title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
              <SlidersHorizontal size={18} color="var(--accent)" />
              <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Filter Catalog</h3>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="form-label">Keyword</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Filter name..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  style={{ paddingRight: '40px', paddingY: '10px' }}
                />
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Categories checkbox list */}
            <div>
              <label className="form-label">Collections</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Men', 'Women', 'Unisex', 'Accessories'].map((cat) => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer', color: categoryVal === cat ? 'var(--accent)' : 'var(--text-secondary)' }}>
                    <input 
                      type="checkbox" 
                      checked={categoryVal === cat}
                      onChange={() => handleCategorySelect(cat)}
                      style={{
                        accentColor: 'var(--accent)',
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer'
                      }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Price range slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>Max Price</label>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)' }}>${maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="600" 
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent)',
                  cursor: 'pointer',
                  backgroundColor: 'var(--border-light)',
                  height: '4px',
                  borderRadius: '2px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                <span>$0</span>
                <span>$600</span>
              </div>
            </div>

            {/* Reset trigger button */}
            <button 
              onClick={handleClearFilters}
              className="btn btn-secondary btn-block"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', padding: '10px' }}
            >
              <RefreshCw size={14} /> RESET FILTERS
            </button>
          </aside>

          {/* Right Product Grid column */}
          <main>
            
            {/* Action Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '16px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Showing <strong style={{ color: 'var(--text-primary)' }}>{products.length}</strong> luxurious pieces
              </div>

              {/* Sorting selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ArrowUpDown size={14} color="var(--accent)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sort By:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>
            </div>

            {/* Products catalog listing */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
                Sorting luxury apparel files...
              </div>
            ) : products.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '80px 24px',
                border: '1px dashed var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)'
              }}>
                <p style={{ fontSize: '1rem', letterSpacing: '0.05em', marginBottom: '16px' }}>NO PIECES MATCH YOUR DESIRED FILTERS</p>
                <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>
                  CLEAR ALL FILTERS
                </button>
              </div>
            ) : (
              <div className="grid-3 animate-fade-in">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
