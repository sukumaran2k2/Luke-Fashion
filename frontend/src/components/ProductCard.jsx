import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first size and color
    const size = product.sizes && product.sizes[0] ? product.sizes[0] : 'M';
    const color = product.colors && product.colors[0] ? product.colors[0] : 'Default';
    addToCart(product, 1, size, color);
  };

  const imageSrc = product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80';

  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--radius-sm)',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      overflow: 'hidden',
      transition: 'var(--transition-smooth)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }} className="product-card-container">
      <Link to={`/product/${product._id}`} style={{ display: 'block', overflow: 'hidden', position: 'relative', aspectRatio: '3/4' }}>
        
        {/* Featured luxury badge */}
        {product.isFeatured && (
          <span className="badge badge-accent" style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: '5',
            fontSize: '0.7rem',
            padding: '4px 8px'
          }}>Atelier Featured</span>
        )}

        {/* Stock status indicator */}
        {product.countInStock === 0 && (
          <span className="badge badge-danger" style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: '5',
            fontSize: '0.7rem',
            padding: '4px 8px'
          }}>Sold Out</span>
        )}

        <img 
          src={imageSrc} 
          alt={product.name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="product-card-img"
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        />

        {/* Hover quick add overlay */}
        {product.countInStock > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
            display: 'flex',
            justifyContent: 'center',
            opacity: '0',
            transition: 'var(--transition-smooth)',
            zIndex: '4'
          }} className="quick-add-overlay">
            <button 
              onClick={handleQuickAdd} 
              className="btn btn-primary btn-block"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ShoppingBag size={14} /> QUICK ADD
            </button>
          </div>
        )}
      </Link>

      <div style={{ padding: '20px', flexGrow: '1', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--accent)',
          marginBottom: '6px',
          fontWeight: '500'
        }}>
          {product.category}
        </div>

        <Link to={`/product/${product._id}`} style={{ display: 'block', marginBottom: '8px' }}>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: '500',
            lineHeight: '1.4',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {product.name}
          </h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', color: '#ffb300' }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star 
                key={idx} 
                size={12} 
                fill={idx < Math.round(product.rating || 0) ? '#ffb300' : 'none'} 
                stroke={idx < Math.round(product.rating || 0) ? '#ffb300' : 'var(--text-muted)'} 
              />
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ({product.numReviews || 0})
          </span>
        </div>

        <div style={{
          marginTop: 'auto',
          fontSize: '1.15rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          letterSpacing: '0.02em'
        }}>
          ${product.price.toFixed(2)}
        </div>
      </div>

      {/* Styled quick view injection triggers */}
      <style>{`
        .product-card-container:hover {
          transform: translateY(-4px);
          border-color: var(--border-medium);
          box-shadow: var(--shadow-light);
        }
        .product-card-container:hover .quick-add-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};
