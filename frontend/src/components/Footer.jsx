import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, HelpCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-light)',
      padding: '80px 0 40px',
      marginTop: '100px',
      color: 'var(--text-secondary)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
          gap: '40px',
          marginBottom: '60px'
        }} className="grid-3">
          <div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.6rem',
              color: 'var(--text-primary)',
              marginBottom: '20px',
              letterSpacing: '0.05em'
            }}>LUKE FASHION</h3>
            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.6',
              marginBottom: '24px',
              maxWidth: '320px'
            }}>
              Crafting premium contemporary fashion and luxury staples. Designed in Tuscany, worn globally. Experience premium quality.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <ShieldCheck size={16} color="var(--accent)" /> Secure Checkout
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <HelpCircle size={16} color="var(--accent)" /> 24/7 Support
              </div>
            </div>
          </div>

          <div>
            <h4 style={{
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '20px'
            }}>Collections</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><a href="/shop?category=Men">Men's Apparel</a></li>
              <li><a href="/shop?category=Women">Women's Collection</a></li>
              <li><a href="/shop?category=Unisex">Unisex Premium</a></li>
              <li><a href="/shop?category=Accessories">Luxury Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '20px'
            }}>Assistance</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><a href="/profile">Order Status</a></li>
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">Size Guides</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '20px'
            }}>The Atelier newsletter</h4>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
              Subscribe to unlock private sales, new collections, and atelier updates.
            </p>
            <div style={{ display: 'flex' }}>
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-light)',
                  borderRight: 'none',
                  padding: '12px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  width: '100%',
                  outline: 'none'
                }}
              />
              <button className="btn btn-primary" style={{ padding: '0 20px', fontSize: '0.8rem' }}>
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          fontSize: '0.85rem'
        }}>
          <div>
            &copy; {new Date().getFullYear()} LUKE FASHION ATELIER. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
