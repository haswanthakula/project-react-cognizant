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
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [postCode, setPostCode] = useState('');
  const [country, setCountry] = useState('');

  // payment state (raw inputs)
  const [cardType, setCardType] = useState('Visa');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState(''); // MM/YY
  const [cvv, setCvv] = useState('');

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
    setAddressLine((data.shippingAddress && data.shippingAddress.addressLine) || '');
    setCity((data.shippingAddress && data.shippingAddress.city) || '');
    setPostCode((data.shippingAddress && data.shippingAddress.postCode) || '');
    setCountry((data.shippingAddress && data.shippingAddress.country) || '');

    // paymentDetails example: { cardType, cardName, cardMasked, cardLast4, expiry }
    if (data.paymentDetails) {
      const pd = data.paymentDetails;
      setCardType(pd.cardType ?? 'Visa');
      setCardName(pd.cardName ?? '');
      setCardNumber(pd.cardMasked ? pd.cardMasked.replace(/\*/g, '') : ''); // masked to empty
      setExpiry(pd.expiry ?? '');
      // we never load CVV (not saved)
    } else {
      setCardType('Visa');
      setCardName('');
      setCardNumber('');
      setExpiry('');
    }
  }

  function validate() {
    const e = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Invalid email';

    // password optional
    if (password && password.length < 6) e.password = 'Password must be at least 6 characters';

    // if user filled any card field, require the full set
    const anyPayment = cardName.trim() || cardNumber.trim() || expiry.trim() || cvv.trim();
    if (anyPayment) {
      if (!cardName.trim()) e.cardName = 'Cardholder name required';
      if (!cardNumber.trim()) e.cardNumber = 'Card number required';
      else {
        const digits = (cardNumber.match(/\d/g) || []).join('');
        const expected = CARD_INFO[cardType]?.cardDigits ?? 16;
        if (digits.length !== expected) e.cardNumber = `Card number must be ${expected} digits for ${cardType}`;
      }
      if (!expiry.trim()) e.expiry = 'Expiry required (MM/YY)';
      else {
        // basic check
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim())) e.expiry = 'Expiry must be MM/YY';
        else {
          // simple not-expired check
          const [m, y] = expiry.split('/');
          const exp = new Date(2000 + Number(y), Number(m) - 1, 1);
          const now = new Date();
          exp.setMonth(exp.getMonth() + 1); // end of expiry month
          if (exp <= now) e.expiry = 'Card looks expired';
        }
      }
      if (!cvv.trim()) e.cvv = 'CVV required';
      else {
        const expectedCvv = CARD_INFO[cardType]?.cvvLength ?? 3;
        if (!/^\d+$/.test(cvv) || cvv.length !== expectedCvv) e.cvv = `CVV must be ${expectedCvv} digits`;
      }
    }

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
        shippingAddress: {
          addressLine: addressLine.trim(),
          city: city.trim(),
          postCode: postCode.trim(),
          country: country.trim()
        }
      };

      if (password) payload.password = password;

      // payment details — only store masked number and last4, do NOT store CVV
      const anyPayment = cardName.trim() || cardNumber.trim() || expiry.trim();
      if (anyPayment) {
        const digits = (cardNumber.match(/\d/g) || []).join('');
        const last4 = digits.slice(-4);
        payload.paymentDetails = {
          cardType,
          cardName: cardName.trim(),
          cardMasked: maskCardNumber(digits),
          cardLast4: last4,
          expiry: expiry.trim()
        };
      } else {
        // if user cleared payment fields, remove paymentDetails
        payload.paymentDetails = null;
      }

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
      setCvv('');
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
              <label>New Password (optional)</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
              {errors.password && <div className="field-err">{errors.password}</div>}
            </div>
          </div>

          <h3 className="section-title">Shipping Address</h3>
          <div className="row">
            <div className="field field-full">
              <label>Address Line</label>
              <input value={addressLine} onChange={e => setAddressLine(e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div className="field">
              <label>City</label>
              <input value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="field">
              <label>Post Code</label>
              <input value={postCode} onChange={e => setPostCode(e.target.value)} />
            </div>
            <div className="field">
              <label>Country</label>
              <input value={country} onChange={e => setCountry(e.target.value)} />
            </div>
          </div>

          <h3 className="section-title">Payment Details</h3>

          <div className="row payment-row">
            <div className="field card-type-field">
              <label>Card Type</label>
              <div className="card-type-select">
                <div className="card-type-icon">{IconForCard(cardType)}</div>
                <select value={cardType} onChange={e => setCardType(e.target.value)}>
                  <option value="Visa">Visa</option>
                  <option value="MasterCard">MasterCard</option>
                  <option value="Rupay">Rupay</option>
                  <option value="American Express">American Express</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Cardholder Name</label>
              <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Name on card" />
              {errors.cardName && <div className="field-err">{errors.cardName}</div>}
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Card Number</label>
              <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder={cardType === 'American Express' ? '15 digits' : '16 digits'} inputMode="numeric" />
              {errors.cardNumber && <div className="field-err">{errors.cardNumber}</div>}
            </div>

            <div className="field">
              <label>Expiry (MM/YY)</label>
              <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" />
              {errors.expiry && <div className="field-err">{errors.expiry}</div>}
            </div>

            <div className="field">
              <label>CVV</label>
              <input type="password" value={cvv} onChange={e => setCvv(e.target.value)} placeholder={CARD_INFO[cardType].cvvLength === 4 ? '4 digits' : '3 digits'} inputMode="numeric" />
              {errors.cvv && <div className="field-err">{errors.cvv}</div>}
              <div className="small-note">CVV is not stored.</div>
            </div>
          </div>

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
