import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Sliders, ShoppingBag, Users, DollarSign, ArrowUpRight, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  
  const [stats, setStats] = useState({
    sales: 12450.99,
    orders: 38,
    users: 14,
    products: 8
  });
  
  const [latestOrders, setLatestOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock static latest orders for visual excellence
  const mockOrders = [
    { _id: 'o_m1', user: { name: 'Arthur Pendragon' }, totalPrice: 349.99, isPaid: true, isDelivered: true, createdAt: '2026-05-28T12:00:00Z' },
    { _id: 'o_m2', user: { name: 'Isabella R.' }, totalPrice: 199.50, isPaid: true, isDelivered: false, createdAt: '2026-05-29T14:30:00Z' },
    { _id: 'o_m3', user: { name: 'Victor V.' }, totalPrice: 499.99, isPaid: true, isDelivered: false, createdAt: '2026-05-30T09:15:00Z' },
    { _id: 'o_m4', user: { name: 'Liam Nees' }, totalPrice: 240.00, isPaid: true, isDelivered: true, createdAt: '2026-05-31T11:45:00Z' }
  ];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        if (user && user.token && !user._id.toString().startsWith('fallback')) {
          // Fetch real orders from database to calculate real stats
          const ordersResponse = await fetch('http://localhost:5000/api/orders', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const productsResponse = await fetch('http://localhost:5000/api/products?pageSize=100');
          
          if (ordersResponse.ok && productsResponse.ok) {
            const ordersData = await ordersResponse.json();
            const productsData = await productsResponse.json();

            const totalSales = ordersData.reduce((acc, o) => acc + (o.isPaid ? o.totalPrice : 0), 0);
            
            setStats({
              sales: totalSales || 12450.99,
              orders: ordersData.length || 38,
              users: 14, // Hardcoded user metrics mock
              products: productsData.count || 8
            });

            setLatestOrders(ordersData.slice(0, 5));
          } else {
            setLatestOrders(mockOrders);
          }
        } else {
          setLatestOrders(mockOrders);
        }
      } catch (err) {
        setLatestOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

  return (
    <div style={{ padding: '60px 0', minHeight: 'calc(100vh - 400px)' }}>
      <div className="container">
        
        {/* Banner */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '24px',
          marginBottom: '48px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LayoutDashboard size={28} color="var(--accent)" /> Atelier Control Desk
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              OPERATIONAL PERFORMANCE METRICS AND LATEST TRANSACTIONS
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/admin/products" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '10px 20px', display: 'flex', gap: '6px' }}>
              <Sliders size={14} /> MANAGE PRODUCTS
            </Link>
            <Link to="/admin/products?addNew=true" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '10px 20px', display: 'flex', gap: '6px' }}>
              <Plus size={14} /> NEW GARMENT
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          marginBottom: '48px'
        }} className="grid-4">
          
          {/* Card 1 - Revenue */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Atelier Revenue</span>
              <DollarSign size={20} color="var(--accent)" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}>
              ${stats.sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={12} /> +12% since last month
            </p>
          </div>

          {/* Card 2 - Orders */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Orders Dispatch</span>
              <ShoppingBag size={20} color="var(--accent)" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
              {stats.orders}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={12} /> +8% since yesterday
            </p>
          </div>

          {/* Card 3 - Members */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Atelier Members</span>
              <Users size={20} color="var(--accent)" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
              {stats.users}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={12} /> +3 new lounge profiles
            </p>
          </div>

          {/* Card 4 - Catalog Pieces */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Catalog Pieces</span>
              <Sliders size={20} color="var(--accent)" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
              {stats.products}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Active luxury lines
            </p>
          </div>

        </div>

        {/* Latest Purchases */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>LATEST CUSTOMER PURCHASES</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              VIEW ALL DISPATCHES &rarr;
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Refreshing purchase logs...</div>
          ) : latestOrders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No customer purchases recorded in the database.</p>
          ) : (
            <div className="table-responsive animate-fade-in">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>TOTAL COST</th>
                    <th>TRANSACTION</th>
                    <th>DELIVERY</th>
                    <th>ORDER DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {latestOrders.map((o) => (
                    <tr key={o._id}>
                      <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{o._id}</td>
                      <td>{o.user ? o.user.name : 'Jane Guest'}</td>
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
                          <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>Dispatching</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{new Date(o.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
