import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Notification from '../../components/Notification/Notification';
import './Profile.css';

const API = 'http://localhost:3001';

const CARD_INFO = {
  Visa: { cvvLength: 3, cardDigits: 16 },
  MasterCard: { cvvLength: 3, cardDigits: 16 },
  Rupay: { cvvLength: 3, cardDigits: 16 },
  'American Express': { cvvLength: 4, cardDigits: 15 }
};

function IconForCard(type) {
  // small inline SVGs — basic shapes so no external assets needed
  const common = { width: 26, height: 18, viewBox: '0 0 32 20' };
  switch (type) {
    case 'Visa':
      return (
        <svg {...common} aria-hidden className="card-icon visa">
          <rect x="0" y="0" width="32" height="20" rx="3" fill="#1a1f71" />
          <text x="6" y="14" fill="#fff" fontSize="9" fontWeight="700">V</text>
        </svg>
      );
    case 'MasterCard':
      return (
        <svg {...common} aria-hidden className="card-icon mc">
          <rect x="0" y="0" width="32" height="20" rx="3" fill="#111" />
          <circle cx="12" cy="10" r="5.8" fill="#ff5f00" />
          <circle cx="20" cy="10" r="5.8" fill="#eb001b" />
        </svg>
      );
    case 'Rupay':
      return (
        <svg {...common} aria-hidden className="card-icon rupay">
          <rect x="0" y="0" width="32" height="20" rx="3" fill="#0b5a40" />
          <text x="4" y="14" fill="#fff" fontSize="7" fontWeight="700">RUPAY</text>
        </svg>
      );
    case 'American Express':
      return (
        <svg {...common} aria-hidden className="card-icon amex">
          <rect x="0" y="0" width="32" height="20" rx="3" fill="#2e77bb" />
          <text x="3" y="14" fill="#fff" fontSize="6.2" fontWeight="700">AMEX</text>
        </svg>
      );
    default:
      return null;
  }
}

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, login: setAuthUser } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.username !== username) {
      navigate(`/profile/${user.username}`);
    }
  }, [user, username, navigate]);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [notif, setNotif] = useState({ message: '', type: 'info', visible: false });

  // profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Addresses state
  const [addresses, setAddresses] = useState([{
    id: `addr-${Date.now()}`,
    type: 'home',
    addressLine: '',
    city: '',
    postCode: '',
    country: '',
    isDefault: true
  }]);

  // payment state (raw inputs)
  const [paymentMethods, setPaymentMethods] = useState([{
    id: `pm-${Date.now()}`,
    cardType: 'Visa',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    isDefault: true
  }]);

  const [activeTab, setActiveTab] = useState('profile');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        setLoading(true);
        if (user.id) {
          const res = await fetch(`${API}/users/${user.id}`);
          if (!res.ok) throw new Error('Failed to load user');
          const data = await res.json();
          populateForm(data);
        } else {
          const res = await fetch(`${API}/users?username=${encodeURIComponent(user.username)}`);
          const arr = await res.json();
          if (arr.length > 0) populateForm(arr[0]);
          else throw new Error('User not found');
        }
      } catch (err) {
        console.error(err);
        setNotif({ message: 'Unable to load profile', type: 'error', visible: true });
        setTimeout(() => setNotif(v => ({ ...v, visible: false })), 900);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function populateForm(data) {
    setUserId(data.id ?? null);
    setFirstName(data.firstName ?? '');
    setLastName(data.lastName ?? '');
    setEmail(data.email ?? '');
    setPhone(data.phone ?? '');

    // Set addresses from data or default empty address
    if (data.addresses && data.addresses.length > 0) {
      setAddresses(data.addresses);
    } else {
      // If no addresses, create a default one
      setAddresses([{
        id: `addr-${Date.now()}`,
        type: 'home',
        addressLine: '',
        city: '',
        postCode: '',
        country: '',
        isDefault: true
      }]);
    }

    // Set payment methods from data or default empty payment method
    if (data.paymentMethods && data.paymentMethods.length > 0) {
      setPaymentMethods(data.paymentMethods);
    } else {
      setPaymentMethods([{
        id: `pm-${Date.now()}`,
        cardType: 'Visa',
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        isDefault: true
      }]);
    }
  }

  // Add new address
  const addNewAddress = () => {
    setAddresses([...addresses, {
      id: `addr-${Date.now()}`,
      type: 'home',
      addressLine: '',
      city: '',
      postCode: '',
      country: '',
      isDefault: addresses.length === 0 // Set as default if it's the first address
    }]);
  };

  // Remove address
  const removeAddress = (id) => {
    const newAddresses = addresses.filter(addr => addr.id !== id);
    // If we removed the default and there are other addresses, set the first one as default
    if (newAddresses.length > 0 && !newAddresses.some(a => a.isDefault)) {
      newAddresses[0].isDefault = true;
    }
    setAddresses(newAddresses);
  };

  // Update address
  const updateAddress = (id, field, value) => {
    setAddresses(addresses.map(addr => {
      if (addr.id === id) {
        return { ...addr, [field]: value };
      }
      return addr;
    }));
  };

  // Set default address
  const setDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  // Similar functions for payment methods
  const addNewPaymentMethod = () => {
    setPaymentMethods([...paymentMethods, {
      id: `pm-${Date.now()}`,
      cardType: 'Visa',
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      isDefault: paymentMethods.length === 0 // Set as default if it's the first payment method
    }]);
  };

  const removePaymentMethod = (id) => {
    const newPaymentMethods = paymentMethods.filter(pm => pm.id !== id);
    // If we removed the default and there are other payment methods, set the first one as default
    if (newPaymentMethods.length > 0 && !newPaymentMethods.some(pm => pm.isDefault)) {
      newPaymentMethods[0].isDefault = true;
    }
    setPaymentMethods(newPaymentMethods);
  };

  const updatePaymentMethod = (id, field, value) => {
    setPaymentMethods(paymentMethods.map(pm => {
      if (pm.id === id) {
        return { ...pm, [field]: value };
      }
      return pm;
    }));
  };

  const setDefaultPaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
  };

  function validate() {
    const e = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Invalid email';
    if (phone && !/^\d{10,}$/.test(phone.trim())) e.phone = 'Phone must be at least 10 digits';

    // password optional
    if (password && password.length < 6) e.password = 'Password must be at least 6 characters';

    // Addresses validation
    addresses.forEach((addr, index) => {
      if (!addr.addressLine.trim()) e[`addressLine${index}`] = 'Address line is required';
      if (!addr.city.trim()) e[`city${index}`] = 'City is required';
      if (!addr.postCode.trim()) e[`postCode${index}`] = 'Post code is required';
      if (!addr.country.trim()) e[`country${index}`] = 'Country is required';
    });

    // Payment methods validation
    paymentMethods.forEach((pm, index) => {
      if (!pm.cardName.trim()) e[`cardName${index}`] = 'Cardholder name is required';
      if (!pm.cardNumber.trim()) e[`cardNumber${index}`] = 'Card number is required';
      else {
        const digits = (pm.cardNumber.match(/\d/g) || []).join('');
        const expected = CARD_INFO[pm.cardType]?.cardDigits ?? 16;
        if (digits.length !== expected) e[`cardNumber${index}`] = `Card number must be ${expected} digits for ${pm.cardType}`;
      }
      if (!pm.expiry.trim()) e[`expiry${index}`] = 'Expiry required (MM/YY)';
      else {
        // basic check
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(pm.expiry.trim())) e[`expiry${index}`] = 'Expiry must be MM/YY';
        else {
          // simple not-expired check
          const [m, y] = pm.expiry.split('/');
          const exp = new Date(2000 + Number(y), Number(m) - 1, 1);
          const now = new Date();
          exp.setMonth(exp.getMonth() + 1); // end of expiry month
          if (exp <= now) e[`expiry${index}`] = 'Card looks expired';
        }
      }
      if (!pm.cvv.trim()) e[`cvv${index}`] = 'CVV required';
      else {
        const expectedCvv = CARD_INFO[pm.cardType]?.cvvLength ?? 3;
        if (!/^\d+$/.test(pm.cvv) || pm.cvv.length !== expectedCvv) e[`cvv${index}`] = `CVV must be ${expectedCvv} digits`;
      }
    });

    return e;
  }

  function maskCardNumber(num) {
    const digits = (num.match(/\d/g) || []).join('');
    if (digits.length <= 4) return `**** **** **** ${digits}`;
    const last4 = digits.slice(-4);
    return `**** **** **** ${last4}`;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    setErrors({});
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    if (!userId) {
      setNotif({ message: 'Missing user id', type: 'error', visible: true });
      setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1200);
      return;
    }

    try {
      // email uniqueness check (exclude current)
      const emailCheckRes = await fetch(`${API}/users?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      const emailArr = await emailCheckRes.json();
      if (emailArr.length > 0 && emailArr.some(u => u.id !== userId)) {
        setErrors({ email: 'Email already used by another account' });
        return;
      }

      // build payload
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        addresses,
        paymentMethods
      };

      if (password) payload.password = password;

      const res = await fetch(`${API}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to update profile');
      const updated = await res.json();

      // refresh auth state (id, username, email)
      setAuthUser(prev => ({
        id: updated.id ?? prev.id,
        username: updated.username ?? prev.username,
        email: updated.email ?? prev.email
      }));

      setNotif({ message: 'Profile updated', type: 'success', visible: true });
      setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1000);
      setPassword('');
    } catch (err) {
      console.error(err);
      setNotif({ message: 'Update failed. Try again.', type: 'error', visible: true });
      setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1200);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="profile-card loading">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="container profile-page">
      <div className="profile-card">
        <h2 className="profile-title">Profile Settings</h2>
        <p className="profile-sub">Update your account and shipping/payment details below</p>

        <form className="profile-form" onSubmit={onSubmit} noValidate>
          <div className="row">
            <div className="field">
              <label>First Name*</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} />
              {errors.firstName && <div className="field-err">{errors.firstName}</div>}
            </div>

            <div className="field">
              <label>Last Name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Email*</label>
              <input value={email} onChange={e => setEmail(e.target.value)} />
              {errors.email && <div className="field-err">{errors.email}</div>}
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" />
              {errors.phone && <div className="field-err">{errors.phone}</div>}
            </div>
            <div className="field">
              <label>New Password (optional)</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
              {errors.password && <div className="field-err">{errors.password}</div>}
            </div>
          </div>

          <h3 className="section-title">Addresses</h3>
          {addresses.map((addr, index) => (
            <div key={addr.id} className="address-card">
              <h4 className="address-title">{addr.type}</h4>
              <div className="row">
                <div className="field">
                  <label>Address Line</label>
                  <input value={addr.addressLine} onChange={e => updateAddress(addr.id, 'addressLine', e.target.value)} />
                  {errors[`addressLine${index}`] && <div className="field-err">{errors[`addressLine${index}`]}</div>}
                </div>
              </div>
              <div className="row">
                <div className="field">
                  <label>City</label>
                  <input value={addr.city} onChange={e => updateAddress(addr.id, 'city', e.target.value)} />
                  {errors[`city${index}`] && <div className="field-err">{errors[`city${index}`]}</div>}
                </div>
                <div className="field">
                  <label>Post Code</label>
                  <input value={addr.postCode} onChange={e => updateAddress(addr.id, 'postCode', e.target.value)} />
                  {errors[`postCode${index}`] && <div className="field-err">{errors[`postCode${index}`]}</div>}
                </div>
                <div className="field">
                  <label>Country</label>
                  <input value={addr.country} onChange={e => updateAddress(addr.id, 'country', e.target.value)} />
                  {errors[`country${index}`] && <div className="field-err">{errors[`country${index}`]}</div>}
                </div>
              </div>
              <div className="actions">
                <button type="button" className="btn secondary" onClick={() => removeAddress(addr.id)}>Remove</button>
                <button type="button" className="btn secondary" onClick={() => setDefaultAddress(addr.id)}>Set as default</button>
              </div>
            </div>
          ))}
          <button type="button" className="btn primary" onClick={addNewAddress}>Add new address</button>

          <h3 className="section-title">Payment Methods</h3>
          {paymentMethods.map((pm, index) => (
            <div key={pm.id} className="payment-method-card">
              <h4 className="payment-method-title">{pm.cardType}</h4>
              <div className="row payment-row">
                <div className="field card-type-field">
                  <label>Card Type</label>
                  <div className="card-type-select">
                    <div className="card-type-icon">{IconForCard(pm.cardType)}</div>
                    <select value={pm.cardType} onChange={e => updatePaymentMethod(pm.id, 'cardType', e.target.value)}>
                      <option value="Visa">Visa</option>
                      <option value="MasterCard">MasterCard</option>
                      <option value="Rupay">Rupay</option>
                      <option value="American Express">American Express</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Cardholder Name</label>
                  <input value={pm.cardName} onChange={e => updatePaymentMethod(pm.id, 'cardName', e.target.value)} placeholder="Name on card" />
                  {errors[`cardName${index}`] && <div className="field-err">{errors[`cardName${index}`]}</div>}
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label>Card Number</label>
                  <input value={pm.cardNumber} onChange={e => updatePaymentMethod(pm.id, 'cardNumber', e.target.value)} placeholder={pm.cardType === 'American Express' ? '15 digits' : '16 digits'} inputMode="numeric" />
                  {errors[`cardNumber${index}`] && <div className="field-err">{errors[`cardNumber${index}`]}</div>}
                </div>

                <div className="field">
                  <label>Expiry (MM/YY)</label>
                  <input value={pm.expiry} onChange={e => updatePaymentMethod(pm.id, 'expiry', e.target.value)} placeholder="MM/YY" />
                  {errors[`expiry${index}`] && <div className="field-err">{errors[`expiry${index}`]}</div>}
                </div>

                <div className="field">
                  <label>CVV</label>
                  <input type="password" value={pm.cvv} onChange={e => updatePaymentMethod(pm.id, 'cvv', e.target.value)} placeholder={CARD_INFO[pm.cardType].cvvLength === 4 ? '4 digits' : '3 digits'} inputMode="numeric" />
                  {errors[`cvv${index}`] && <div className="field-err">{errors[`cvv${index}`]}</div>}
                  <div className="small-note">CVV is not stored.</div>
                </div>
              </div>
              <div className="actions">
                <button type="button" className="btn secondary" onClick={() => removePaymentMethod(pm.id)}>Remove</button>
                <button type="button" className="btn secondary" onClick={() => setDefaultPaymentMethod(pm.id)}>Set as default</button>
              </div>
            </div>
          ))}
          <button type="button" className="btn primary" onClick={addNewPaymentMethod}>Add new payment method</button>

          <div className="actions">
            <button type="submit" className="btn primary">Save Changes</button>
            <button type="button" className="btn secondary" onClick={() => {
              if (user && user.id) {
                fetch(`${API}/users/${user.id}`).then(r => r.json()).then(populateForm).catch(() => {});
              }
            }}>Revert</button>
          </div>
        </form>
      </div>

      <Notification message={notif.message} type={notif.type} visible={notif.visible} />
    </div>
  );
}
