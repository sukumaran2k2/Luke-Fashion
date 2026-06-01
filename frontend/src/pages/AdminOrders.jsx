import React, { useState, useEffect, useContext } from 'react';
import { ShoppingBag, CheckCircle, Truck, RefreshCw, ChevronRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const AdminOrders = () => {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  // Mock static fallback purchases
  const mockOrders = [
    {
      _id: 'mock_order_1',
      user: { name: 'Arthur Pendragon', email: 'arthur@king.com' },
      createdAt: '2026-05-20T10:00:00Z',
      totalPrice: 349.99,
      isPaid: true,
      paidAt: '2026-05-20T10:05:00Z',
      isDelivered: false
    },
    {
      _id: 'mock_order_2',
      user: { name: 'Jane Buyer', email: 'buyer@lukefashion.com' },
      createdAt: '2026-05-25T14:30:00Z',
      totalPrice: 199.50,
      isPaid: true,
      paidAt: '2026-05-25T14:32:00Z',
      isDelivered: true,
      deliveredAt: '2026-05-28T09:00:00Z'
    }
  ];

  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      try {
        if (user && user.token && !user._id.toString().startsWith('fallback')) {
          const response = await fetch('http://localhost:5000/api/orders', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (response.ok) {
            const data = await response.json();
            
            // Merge custom mock orders
            const localMocks = JSON.parse(localStorage.getItem('mockOrders') || '[]');
            setOrders([...localMocks, ...data]);
          } else {
            loadFallback();
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
      const localMocks = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      if (localMocks.length === 0) {
        setOrders(mockOrders);
      } else {
        setOrders([...localMocks, ...mockOrders]);
      }
    };

    fetchAllOrders();
  }, [user, triggerRefresh]);

  const handleMarkAsDelivered = async (orderId) => {
    if (!window.confirm('Do you want to mark this premium order as hand-delivered?')) return;

    try {
      if (orderId.startsWith('mock_order_')) {
        // Edit local mock orders
        const localMocks = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        const idx = localMocks.findIndex(x => x._id === orderId);
        
        if (idx > -1) {
          localMocks[idx].isDelivered = true;
          localMocks[idx].deliveredAt = new Date().toISOString();
          localStorage.setItem('mockOrders', JSON.stringify(localMocks));
          alert('Mock order flagged as Hand-Delivered.');
        } else {
          // If in static mockOrders list
          const found = mockOrders.find(x => x._id === orderId);
          if (found) {
            found.isDelivered = true;
            found.deliveredAt = new Date().toISOString();
            localStorage.setItem('mockOrders', JSON.stringify([found, ...localMocks]));
            alert('Order flagged as Hand-Delivered.');
          }
        }
        setTriggerRefresh(!triggerRefresh);
      } else {
        // Database dispatch mark
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}/deliver`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        if (response.ok) {
          alert('Order dispatched and successfully marked as delivered!');
          setTriggerRefresh(!triggerRefresh);
        } else {
          const data = await response.json();
          alert(data.message || 'Error processing delivery mark');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error updating delivery status');
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
              <ShoppingBag size={28} color="var(--accent)" /> Manage Atelier Dispatches
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              MONITOR CUSTOMER STAPLES PURCHASES AND COMMENCE COURIER DELIVERY FLAGS
            </p>
          </div>

          <button onClick={() => setTriggerRefresh(!triggerRefresh)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={14} /> REFRESH RECORDS
          </button>
        </div>

        {/* Listing Orders */}
        {loading ? (
          <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>Gathering courier shipping log sheets...</div>
        ) : orders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No customer orders have been logged in the system.</p>
        ) : (
          <div className="table-responsive animate-fade-in">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>BUYER</th>
                  <th>TOTAL VALUE</th>
                  <th>PAID STATUS</th>
                  <th>DISPATCH STATUS</th>
                  <th>DATE PLACE</th>
                  <th>OPERATIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{o._id}</td>
                    <td style={{ fontWeight: 500 }}>{o.user ? o.user.name : 'Jane Guest'}</td>
                    <td style={{ fontWeight: 600 }}>${o.totalPrice.toFixed(2)}</td>
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
                        <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>In Dispatch</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      {!o.isDelivered ? (
                        <button 
                          onClick={() => handleMarkAsDelivered(o._id)}
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Truck size={12} /> MARK DELIVERED
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={12} color="var(--success)" /> Handled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
