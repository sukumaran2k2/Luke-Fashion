import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Heart, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Luxury local fallbacks in case DB is not seeded or backend is offline
  const fallbackFeatured = [
    {
      _id: 'fallback1',
      name: 'Luke Gold Embroidered Blazer',
      price: 349.99,
      category: 'Men',
      images: ['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      rating: 4.8,
      numReviews: 4,
      sizes: ['M', 'L'],
      countInStock: 5
    },
    {
      _id: 'fallback2',
      name: 'Luke Silk Slip Dress',
      price: 199.50,
      category: 'Women',
      images: ['https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      rating: 4.9,
      numReviews: 2,
      sizes: ['S', 'M'],
      countInStock: 8
    },
    {
      _id: 'fallback3',
      name: 'Luke Minimalist Leather Chelsea Boots',
      price: 240.00,
      category: 'Men',
      images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      rating: 4.7,
      numReviews: 1,
      sizes: ['9', '10'],
      countInStock: 12
    },
    {
      _id: 'fallback4',
      name: 'Luke Classic Leather Trench Coat',
      price: 499.99,
      category: 'Women',
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
      rating: 5.0,
      numReviews: 3,
      sizes: ['S', 'M'],
      countInStock: 4
    }
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products?isFeatured=true');
        if (response.ok) {
          const data = await response.json();
          if (data.products && data.products.length > 0) {
            setFeaturedProducts(data.products);
          } else {
            setFeaturedProducts(fallbackFeatured);
          }
        } else {
          setFeaturedProducts(fallbackFeatured);
        }
      } catch (err) {
        setFeaturedProducts(fallbackFeatured);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: 'calc(100vh - 80px)',
        minHeight: '600px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#050507'
      }}>
        {/* Background Image with Dark Mask */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          opacity: 0.45,
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '650px' }} className="animate-fade-in-up">
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--accent)',
              display: 'block',
              marginBottom: '16px'
            }}>Atelier Collection 2026</span>
            
            <h1 style={{
              fontSize: '4rem',
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-primary)',
              lineHeight: '1.1',
              marginBottom: '24px',
              fontWeight: 400
            }}>
              Sculpted Elegance. <br />
              <span style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>Timeless Refinement.</span>
            </h1>

            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              color: 'var(--text-secondary)',
              marginBottom: '40px',
              maxWidth: '520px'
            }}>
              Discover premium contemporary garments designed in Italy. Impeccable tailoring meets organic luxury textiles to define your signature statement.
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/shop" className="btn btn-primary" style={{ padding: '14px 32px' }}>
                DISCOVER THE SHOP <ArrowRight size={16} />
              </Link>
              <Link to="/shop?category=Women" className="btn btn-secondary" style={{ padding: '14px 32px' }}>
                WOMEN'S LINE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust benefits banner */}
      <section style={{
        padding: '40px 0',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '300px' }}>
              <Truck size={36} color="var(--accent)" strokeWidth={1.5} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Complimentary Delivery</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Free shipping on all premium orders over $150</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '300px' }}>
              <RefreshCw size={36} color="var(--accent)" strokeWidth={1.5} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Elegant returns</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>30 days premium hassle-free home pickups and exchanges</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '300px' }}>
              <ShieldCheck size={36} color="var(--accent)" strokeWidth={1.5} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Atelier Quality</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Certified sustainable materials and hand-crafted cuts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Category Grid Showcase */}
      <section style={{ padding: '100px 0 60px' }}>
        <div className="container">
          <div className="section-header">
            <h2>CURATED COLLECTIONS</h2>
            <p>DESIGNED TO INSPIRE INDIVIDUAL STYLE</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px'
          }} className="grid-3">
            
            {/* Category 1 - Men */}
            <div style={{
              position: 'relative',
              aspectRatio: '3/4',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--border-light)'
            }} className="category-block">
              <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: 'url("https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.8s ease'
              }} className="category-img" />
              <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '32px'
              }}>
                <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>THE MODERNE MAN</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Sharp lines, premium tailoring.</p>
                <Link to="/shop?category=Men" className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.8rem', alignSelf: 'flex-start' }}>
                  EXPLORE <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Category 2 - Women */}
            <div style={{
              position: 'relative',
              aspectRatio: '3/4',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--border-light)'
            }} className="category-block">
              <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: 'url("https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.8s ease'
              }} className="category-img" />
              <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '32px'
              }}>
                <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>FEMININE REFINE</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Mulberry silks and custom drapes.</p>
                <Link to="/shop?category=Women" className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.8rem', alignSelf: 'flex-start' }}>
                  EXPLORE <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Category 3 - Accessories */}
            <div style={{
              position: 'relative',
              aspectRatio: '3/4',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--border-light)'
            }} className="category-block">
              <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: 'url("https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.8s ease'
              }} className="category-img" />
              <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '32px'
              }}>
                <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>FINE APPARATUS</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Hand-tanned leathers and titanium.</p>
                <Link to="/shop?category=Accessories" className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.8rem', alignSelf: 'flex-start' }}>
                  EXPLORE <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Atelier Section */}
      <section style={{
        padding: '80px 0 100px',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container">
          <div className="section-header">
            <h2>ATELIER FEATURED</h2>
            <p>OUR HIGHEST QUALITY STAPLES RE-IMAGINED</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              Loading the Atelier showcase...
            </div>
          ) : (
            <div className="grid-4">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link to="/shop" className="btn btn-secondary" style={{ padding: '12px 36px' }}>
              VIEW THE COMPLETE ATELIER CATALOG
            </Link>
          </div>
        </div>
      </section>

      {/* Atelier Quote Section */}
      <section style={{ padding: '120px 0', textClassName: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span style={{ fontSize: '1.5rem', color: 'var(--accent)', fontFamily: 'var(--font-serif)', display: 'block', marginBottom: '24px' }}>“</span>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            lineHeight: '1.5',
            color: 'var(--text-primary)',
            fontStyle: 'italic',
            marginBottom: '32px'
          }}>
            Luxury is not about standing out, it is about being remembered. It is the texture of the silk, the structure of the seam, the comfort of the fit, and the story of sustainable design.
          </p>
          <div style={{
            width: '40px',
            height: '1px',
            backgroundColor: 'var(--accent)',
            margin: '0 auto 16px'
          }} />
          <h5 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Luke Atelier Director
          </h5>
        </div>
      </section>

      {/* CSS overrides for category block zoom */}
      <style>{`
        .category-block:hover .category-img {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
};
