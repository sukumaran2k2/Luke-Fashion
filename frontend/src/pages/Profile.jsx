import React, { useState, useEffect, useContext } from 'react';
import { User, Mail, Lock, ShieldAlert, Award, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const Profile = () => {
  const { user, updateProfile, error, setError } = useContext(AuthContext);
  
  // Profile form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // Orders states
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeOrderDetails, setActiveOrderDetails] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
    setError(null);
  }, [user]);

  // Load orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setLoadingOrders(true);
      try {
        if (user._id.toString().startsWith('fallback')) {
          loadMockOrders();
        } else {
          const response = await fetch('http://localhost:5000/api/orders/myorders', {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            
            // Append local mock orders as well
            const mock = JSON.parse(localStorage.getItem('mockOrders') || '[]');
            setOrders([...data, ...mock]);
          } else {
            loadMockOrders();
          }
        }
      } catch (err) {
        loadMockOrders();
      } finally {
        setLoadingOrders(false);
      }
    };

    const loadMockOrders = () => {
      const mock = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      setOrders(mock);
    };

    fetchOrders();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setUpdateSuccess(false);

    if (password && password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    setLoadingUpdate(true);
    try {
      if (user._id.toString().startsWith('fallback')) {
        // Mock offline updates
        alert('Mock user details updated successfully.');
        setUpdateSuccess(true);
      } else {
        const payload = { name, email };
        if (password) payload.password = password;
        
        await updateProfile(payload);
        setUpdateSuccess(true);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setFormError(err.message || 'Profile update failed');
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: 'calc(100vh - 400px)' }}>
      <div className="container">
        
        {/* Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '48px',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '24px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-light)',
            border: '1px solid var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <User size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)' }}>Atelier Member Lounge</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              MANAGE PROFILE DETAILS AND TRACK ORDER RECORDS
            </p>
          </div>
        </div>

        {/* Split layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '48px' }} className="grid-2">
          
          {/* Left: profile edit */}
          <aside>
            <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} color="var(--accent)" /> MEMBER DETAILS
              </h3>

              {formError && (
                <div style={{ padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '16px' }}>
                  {formError}
                </div>
              )}

              {updateSuccess && (
                <div style={{ padding: '10px 14px', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', color: 'var(--success)', fontSize: '0.8rem', marginBottom: '16px' }}>
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Full name */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                    <User size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Email address */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Mail size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Password change */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Change Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type="password" placeholder="••••••••" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Lock size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Confirm password change */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type="password" placeholder="••••••••" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <Lock size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '8px' }} disabled={loadingUpdate}>
                  {loadingUpdate ? 'SAVING...' : 'UPDATE PROFILE'}
                </button>
              </form>
            </div>
          </aside>

          {/* Right: order records */}
          <main>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={20} color="var(--accent)" /> MY PURCHASE STAPLES ({orders.length})
            </h3>

            {loadingOrders ? (
              <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>Gathering purchase catalogs...</div>
            ) : orders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                border: '1px dashed var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)'
              }}>
                <p style={{ fontSize: '0.95rem', letterSpacing: '0.05em', marginBottom: '16px' }}>YOU HAVE NOT PLACED ANY ORDERS YET</p>
                <a href="/shop" className="btn btn-secondary btn-sm">BROWSE ATELIER CATALOG</a>
              </div>
            ) : (
              <div className="table-responsive animate-fade-in">
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>ORDER ID</th>
                      <th>DATE</th>
                      <th>TOTAL PRICE</th>
                      <th>PAYMENT</th>
                      <th>DELIVERY</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id}>
                        <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{o._id}</td>
                        <td style={{ fontSize: '0.85rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td style={{ fontWeight: '600' }}>${o.totalPrice.toFixed(2)}</td>
                        <td>
                          {o.isPaid ? (
                            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Paid</span>
                          ) : (
                            <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>Unpaid</span>
                          )}
                        </td>
                        <td>
                          {o.isDelivered ? (
                            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Delivered</span>
                          ) : (
                            <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>Processing</span>
                          )}
                        </td>
                        <td>
                          <button 
                            onClick={() => setActiveOrderDetails(activeOrderDetails === o._id ? null : o._id)}
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            {activeOrderDetails === o._id ? <EyeOff size={12} /> : <Eye size={12} />} DETAIL
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Display active order detail pop-up card */}
            {activeOrderDetails && (
              <div 
                className="glass-panel animate-fade-in"
                style={{
                  marginTop: '32px',
                  padding: '24px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)'
                }}
              >
                {(() => {
                  const current = orders.find(x => x._id === activeOrderDetails);
                  if (!current) return null;
                  return (
                    <div>
                      <h4 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '16px', color: 'var(--accent)' }}>
                        ITEMS LIST FOR RECEIPT {current._id}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {current.orderItems.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <img src={item.image} alt={item.name} style={{ width: '40px', height: '53px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                              <div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block' }}>{item.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Size: {item.size} | Color: {item.color} | Qty: {item.qty}</span>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Recipient info summary */}
                      <div style={{
                        marginTop: '20px',
                        borderTop: '1px dashed var(--border-light)',
                        paddingTop: '16px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '24px',
                        fontSize: '0.85rem'
                      }} className="grid-2">
                        <div>
                          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Courier Address:</strong>
                          <span style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            {current.shippingAddress.address}, {current.shippingAddress.city}, {current.shippingAddress.postalCode}, {current.shippingAddress.country}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ display: 'block', color: 'var(--text-muted)' }}>Couriers: Complimentary Air</span>
                          <span style={{ display: 'block', color: 'var(--text-muted)' }}>Status: {current.isDelivered ? 'Hand-Delivered' : 'Under Atelier Dispatch'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
};
