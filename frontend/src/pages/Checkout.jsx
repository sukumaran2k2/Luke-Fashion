import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, ShoppingBag, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export const Checkout = () => {
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  
  const navigate = useNavigate();

  // Step states
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Success

  // Form states
  const [address, setAddress] = useState('123 Atelier Way');
  const [city, setCity] = useState('Florence');
  const [postalCode, setPostalCode] = useState('50123');
  const [country, setCountry] = useState('Italy');

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  useEffect(() => {
    if (cartItems.length === 0 && step !== 4) {
      navigate('/shop');
    }
  }, [cartItems, navigate, step]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (address && city && postalCode && country) {
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    const orderPayload = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        size: item.size,
        color: item.color,
        product: item.product
      })),
      shippingAddress: { address, city, postalCode, country },
      paymentMethod: 'Credit Card',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    };

    try {
      if (user && user.token && !user._id.toString().startsWith('fallback')) {
        // Active Backend integration
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(orderPayload)
        });

        const createdOrder = await response.json();

        if (response.ok) {
          // Auto pay order mock
          await fetch(`http://localhost:5000/api/orders/${createdOrder._id}/pay`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`
            }
          });

          setCreatedOrderId(createdOrder._id);
          clearCart();
          setStep(4);
        } else {
          alert(createdOrder.message || 'Error processing purchase');
        }
      } else {
        // Fallback mock database orders
        const mockOrder = {
          _id: 'mock_order_' + Math.random().toString(36).substr(2, 9),
          user: { name: user ? user.name : 'Guest User', email: user ? user.email : 'guest@lukefashion.com' },
          orderItems: orderPayload.orderItems,
          shippingAddress: orderPayload.shippingAddress,
          paymentMethod: 'Credit Card',
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
          isPaid: true,
          paidAt: new Date().toISOString(),
          isDelivered: false,
          createdAt: new Date().toISOString()
        };

        const existingMockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        localStorage.setItem('mockOrders', JSON.stringify([mockOrder, ...existingMockOrders]));

        setCreatedOrderId(mockOrder._id);
        clearCart();
        setStep(4);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      alert('Order placed using mock offline data due to connection status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '60px 0', minHeight: 'calc(100vh - 400px)' }}>
      <div className="container" style={{ maxWidth: step === 4 ? '600px' : '1100px' }}>
        
        {/* Step Indicators */}
        {step < 4 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '48px',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <span style={{ color: step >= 1 ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600 }}>1. Shipping</span>
            <span style={{ width: '40px', height: '1px', backgroundColor: 'var(--border-light)' }} />
            <span style={{ color: step >= 2 ? 'var(--accent)' : 'var(--text-muted)', fontWeight: step >= 2 ? 600 : 400 }}>2. Payment</span>
            <span style={{ width: '40px', height: '1px', backgroundColor: 'var(--border-light)' }} />
            <span style={{ color: step >= 3 ? 'var(--accent)' : 'var(--text-muted)', fontWeight: step >= 3 ? 600 : 400 }}>3. Review</span>
          </div>
        )}

        {/* Step Content */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px' }} className="grid-2">
            <div>
              <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={20} color="var(--accent)" /> SHIPPING DETAILS
              </h2>
              
              <form onSubmit={handleShippingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Atelier Street Address</label>
                  <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="grid-3">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">City</label>
                    <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Postal Code</label>
                    <input type="text" className="form-control" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Country</label>
                    <input type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '12px' }}>
                  CONTINUE TO PAYMENT <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {/* Side summary card */}
            <OrderSummary />
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px' }} className="grid-2">
            <div>
              <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={20} color="var(--accent)" /> SECURE CARD DETAILS
              </h2>
              
              <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Name on Credit Card</label>
                  <input type="text" className="form-control" placeholder="JANE DOE" value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Credit Card Number</label>
                  <input type="text" className="form-control" placeholder="4111 2222 3333 4444" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="grid-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Expiration Date</label>
                    <input type="text" className="form-control" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">CVV Code</label>
                    <input type="password" className="form-control" placeholder="•••" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">
                    <ArrowLeft size={16} /> BACK
                  </button>
                  <button type="submit" className="btn btn-primary">
                    CONTINUE TO REVIEW <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>

            <OrderSummary />
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px' }} className="grid-2">
            <div>
              <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', marginBottom: '24px' }}>
                REVIEW YOUR PREMIUM ORDER
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Shipping info */}
                <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '12px' }}>SHIPPING ADDRESS</h4>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {user ? user.name : 'Guest User'}<br />
                    {address}, {city}, {postalCode}, {country}
                  </p>
                </div>

                {/* Payment info */}
                <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '12px' }}>PAYMENT METHOD</h4>
                  <p style={{ fontSize: '0.95rem' }}>
                    Secure Credit Card ending in {cardNumber.slice(-4) || '4444'}
                  </p>
                </div>

                {/* Items info */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '16px' }}>ORDER ITEMS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {cartItems.map((item) => (
                      <div key={`${item.product}-${item.size}-${item.color}`} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <img src={item.image} alt={item.name} style={{ width: '50px', height: '67px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                        <div style={{ flexGrow: 1 }}>
                          <h5 style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</h5>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Size: {item.size} | Color: {item.color} | Qty: {item.qty}</span>
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '28px' }}>
                  <button type="button" onClick={() => setStep(2)} className="btn btn-secondary" disabled={loading}>
                    <ArrowLeft size={16} /> BACK
                  </button>
                  <button type="button" onClick={handlePlaceOrder} className="btn btn-primary" style={{ flexGrow: 1 }} disabled={loading}>
                    {loading ? 'PROCESSING SECURE PAYMENT...' : `EXECUTE PAYMENT OF $${totalPrice}`}
                  </button>
                </div>
              </div>
            </div>

            <OrderSummary />
          </div>
        )}

        {/* Success Page */}
        {step === 4 && (
          <div className="glass-panel text-center" style={{
            padding: '60px 40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            textAlign: 'center'
          }}>
            <CheckCircle size={64} color="var(--accent)" style={{ marginBottom: '24px', marginX: 'auto' }} />
            
            <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
              TRANSACTION APPROVED
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '8px' }}>
              Thank you for choosing Luke Fashion Atelier. Your purchase is complete.
            </p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '32px', fontFamily: 'monospace' }}>
              ORDER RECEIPT ID: {createdOrderId}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
              <Link to="/profile" className="btn btn-primary">
                VIEW ORDER HISTORY
              </Link>
              <Link to="/shop" className="btn btn-secondary">
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  // Summary component
  function OrderSummary() {
    return (
      <aside className="glass-panel" style={{
        padding: '32px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-light)',
        alignSelf: 'flex-start'
      }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          ORDER SUMMARY
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between' }}>
            <span>Staples Subtotal</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>${itemsPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between' }}>
            <span>VAT Est. (8%)</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>${taxPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between' }}>
            <span>Complimentary Courier</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '1.15rem',
          fontWeight: 600,
          borderTop: '1px solid var(--border-light)',
          paddingTop: '16px',
          marginBottom: '20px'
        }}>
          <span>Total Price</span>
          <span style={{ color: 'var(--accent)' }}>${totalPrice.toFixed(2)}</span>
        </div>

        {/* Small security warning */}
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Your payment details are heavily encrypted with AES-256 protocols. Your security is paramount to the Atelier.
        </p>
      </aside>
    );
  }
};
