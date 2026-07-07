import { X, CheckCircle, Lock, Zap } from 'lucide-react';
import api from '../services/api';

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PremiumModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const handlePayment = async () => {
    try {
      const { data: order } = await api.post('/payment/create-order');
      const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      const options = {
        key: 'rzp_test_dummy_key_id', 
        amount: order.amount,
        currency: order.currency,
        name: 'NextHire Premium',
        description: 'Unlock 400+ Premium DSA Questions',
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data) {
              onSuccess();
            }
          } catch (err) {
            console.error('Payment Verification Failed:', err);
            alert('Payment verification failed. Please contact support.');
          }
        },
        theme: {
          color: '#6366f1',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Could not initiate payment. Please try again.');
    }
  };

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
  };

  const modalStyle = {
    backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px',
    overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', position: 'relative'
  };

  const closeBtnStyle = {
    position: 'absolute', top: '16px', right: '16px', background: 'transparent',
    border: 'none', cursor: 'pointer', color: '#9ca3af'
  };

  const headerStyle = {
    padding: '32px', textAlign: 'center', background: 'linear-gradient(to bottom right, #eef2ff, #f3e8ff)',
    borderBottom: '1px solid #e0e7ff'
  };

  const iconWrapStyle = {
    margin: '0 auto 16px', background: 'linear-gradient(to right, #6366f1, #9333ea)',
    color: '#fff', width: '64px', height: '64px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
  };

  const featureItemStyle = {
    display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px'
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        <button style={closeBtnStyle} onClick={onClose}>
          <X size={24} />
        </button>

        <div style={headerStyle}>
          <div style={iconWrapStyle}><Zap size={32} /></div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Upgrade to Premium</h2>
          <p style={{ color: '#4b5563', margin: '0 0 16px 0', fontSize: '15px' }}>
            Unlock the ultimate arsenal for cracking FAANG interviews.
          </p>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#111827' }}>
            ₹499 <span style={{ fontSize: '16px', fontWeight: '500', color: '#6b7280', textDecoration: 'line-through' }}>₹1999</span>
          </div>
          <p style={{ fontSize: '14px', color: '#4f46e5', fontWeight: '600', margin: '8px 0 0 0' }}>Lifetime Access</p>
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '32px' }}>
            {[
              { icon: Lock, title: '400+ FAANG Questions', desc: 'Full access to all premium locked topics.' },
              { icon: CheckCircle, title: 'Detailed Solutions', desc: 'Step-by-step logic and optimal approaches.' },
              { icon: Zap, title: 'Ad-Free Experience', desc: 'No distractions. Just pure coding.' }
            ].map((f, i) => (
              <div key={i} style={featureItemStyle}>
                <div style={{ background: '#e0e7ff', color: '#4f46e5', padding: '8px', borderRadius: '8px' }}>
                  <f.icon size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#111827' }}>{f.title}</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handlePayment}
            style={{
              width: '100%', background: 'linear-gradient(to right, #4f46e5, #7e22ce)',
              color: 'white', border: 'none', padding: '16px', borderRadius: '12px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            Unlock Premium Now
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', margin: '16px 0 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Lock size={12} /> Secure Checkout via Razorpay
          </p>
        </div>

      </div>
    </div>
  );
};

export default PremiumModal;
