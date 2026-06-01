import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, LogOut, ChevronDown, Sliders, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, setIsCartOpen } = useContext(CartContext);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      width: '100%',
      zIndex: 900,
      backgroundColor: 'rgba(10, 10, 12, 0.75)',
      borderBottom: '1px solid var(--border-light)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '80px'
      }}>
        {/* Navigation Categories Links */}
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="nav-links-desktop">
          <Link to="/shop" style={{
            fontSize: '0.85rem',
            fontWeight: '500',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>ATELIER SHOP</Link>
          <Link to="/shop?category=Men" style={{
            fontSize: '0.85rem',
            fontWeight: '500',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)'
          }}>MEN</Link>
          <Link to="/shop?category=Women" style={{
            fontSize: '0.85rem',
            fontWeight: '500',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)'
          }}>WOMEN</Link>
          <Link to="/shop?category=Accessories" style={{
            fontSize: '0.85rem',
            fontWeight: '500',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)'
          }}>ACCESSORIES</Link>
        </nav>

        {/* Brand Center Logo */}
        <Link to="/" style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2rem',
          fontWeight: '700',
          letterSpacing: '0.1em',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          LUKE FASHION
        </Link>

        {/* User profile controls and cart bag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          
          {/* Search Trigger */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    marginRight: '8px',
                    width: '180px',
                    outline: 'none',
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                  autoFocus
                />
              </form>
            ) : null}
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              style={{ color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <Search size={20} />
            </button>
          </div>

          {/* User Account Controls */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                <User size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }} className="navbar-username">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} style={{
                  transform: userDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'var(--transition-smooth)'
                }} />
              </button>

              {userDropdownOpen && (
                <div 
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 15px)',
                    right: 0,
                    width: '200px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    padding: '8px 0',
                    zIndex: 950,
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
                  <Link 
                    to="/profile" 
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 18px',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                      borderBottom: '1px solid var(--border-light)'
                    }}
                  >
                    <User size={14} /> My Profile
                  </Link>

                  {user.isAdmin && (
                    <>
                      <Link 
                        to="/admin" 
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 18px',
                          fontSize: '0.85rem',
                          color: 'var(--accent)'
                        }}
                      >
                        <LayoutDashboard size={14} /> Admin Dashboard
                      </Link>
                      <Link 
                        to="/admin/products" 
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 18px',
                          fontSize: '0.85rem',
                          color: 'var(--text-secondary)',
                          borderBottom: '1px solid var(--border-light)'
                        }}
                      >
                        <Sliders size={14} /> Manage Products
                      </Link>
                    </>
                  )}

                  <button 
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 18px',
                      fontSize: '0.85rem',
                      color: 'var(--danger)',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.05em'
            }}>
              <User size={18} />
              <span className="nav-login-text">LOGIN</span>
            </Link>
          )}

          {/* Cart Bag Icon with dynamic badge */}
          <button 
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: 'var(--accent)',
                color: '#000',
                fontSize: '0.7rem',
                fontWeight: '700',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(212, 178, 111, 0.4)'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
