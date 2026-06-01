import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQty,
    itemsPrice,
    totalPrice
  } = useContext(CartContext);

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Backdrop overlay */}
      <div 
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Drawer body */}
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--accent)" />
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              YOUR BAG ({cartItems.reduce((acc, x) => acc + x.qty, 0)})
            </h3>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{ color: 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable list of items */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'var(--text-secondary)',
              gap: '16px'
            }}>
              <ShoppingBag size={48} strokeWidth={1} color="var(--text-muted)" />
              <p style={{ fontSize: '0.95rem', letterSpacing: '0.05em' }}>YOUR BAG IS CURRENTLY EMPTY</p>
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsCartOpen(false)}
                style={{ fontSize: '0.8rem', padding: '10px 20px' }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={`${item.product}-${item.size}-${item.color}`}
                style={{
                  display: 'flex',
                  gap: '16px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid var(--border-light)'
                }}
              >
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80'} 
                  alt={item.name} 
                  style={{
                    width: '80px',
                    height: '107px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)'
                  }}
                />

                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      marginBottom: '4px'
                    }}>{item.name}</h4>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Quantity selectors */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <button 
                        onClick={() => item.qty > 1 && updateQty(item.product, item.size, item.color, item.qty - 1)}
                        style={{ padding: '6px 10px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {item.qty}
                      </span>
                      <button 
                        onClick={() => updateQty(item.product, item.size, item.color, item.qty + 1)}
                        style={{ padding: '6px 10px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => removeFromCart(item.product, item.size, item.color)}
                        style={{ color: 'var(--text-muted)', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions summary */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '24px',
            backgroundColor: 'rgba(255,255,255,0.01)',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>${itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '600' }}>
              <span>Total Est.</span>
              <span style={{ color: 'var(--accent)' }}>${totalPrice.toFixed(2)}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Taxes and shipping calculated at checkout
            </p>
            <button 
              onClick={handleCheckoutClick}
              className="btn btn-primary btn-block"
              style={{ padding: '14px', fontSize: '0.9rem' }}
            >
              PROCEED TO SECURE CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
