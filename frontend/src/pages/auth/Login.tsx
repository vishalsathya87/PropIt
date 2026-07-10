import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../../lib/api';
import { auth } from '../../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

type Step = 'login' | 'choose-role' | 'register' | 'social-complete';

export default function Login() {
  const [step, setStep] = useState<Step>('login');
  const [role, setRole] = useState<'BUYER' | 'SELLER' | null>(null);

  // Login fields (using Email)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Social Sign-in Completion fields
  const [socialUid, setSocialUid] = useState('');
  const [socialEmail, setSocialEmail] = useState('');
  const [socialName, setSocialName] = useState('');
  const [socialPhone, setSocialPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /* ── Login with Email & Password ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // 1. Authenticate with Firebase Client SDK
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      // 2. Temporarily set token so subsequent request is authorized
      setToken(token);

      // 3. Fetch MongoDB user profile (role, phone, etc.)
      const userRes = await api.get('/auth/me');
      const { role: userRole, phone_number } = userRes.data;

      // 4. Save metadata locally
      localStorage.setItem('user_role', userRole);
      localStorage.setItem('user_phone', phone_number);
      window.dispatchEvent(new Event('storage'));

      // 5. Navigate to appropriate dashboard
      if (userRole === 'SELLER') navigate('/dashboard/seller');
      else if (userRole === 'ADMIN') navigate('/dashboard/admin');
      else navigate('/dashboard/buyer');
    } catch (err: any) {
      console.error(err);
      localStorage.removeItem('token');
      setError(err.response?.data?.detail || 'Incorrect email or password, or registration in database is incomplete.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Register with Email & Password ── */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      setError('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');

    let firebaseUser: any = null;
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      setToken(token);

      // 2. Synchronize user profile with backend MongoDB
      await api.post('/auth/register', {
        uid: firebaseUser.uid,
        email: regEmail,
        phone_number: regPhone,
        role,
        full_name: regName,
      });

      // 3. Save role & metadata
      localStorage.setItem('user_role', role || 'BUYER');
      localStorage.setItem('user_phone', regPhone);
      window.dispatchEvent(new Event('storage'));

      // 4. Navigate
      if (role === 'SELLER') navigate('/dashboard/seller');
      else navigate('/dashboard/buyer');
    } catch (err: any) {
      console.error(err);
      // Rollback: if Firebase user was created but backend sync failed, delete Firebase account to allow retries
      if (firebaseUser) {
        try {
          await firebaseUser.delete();
        } catch (cleanupErr) {
          console.error("Failed to clean up Firebase account:", cleanupErr);
        }
      }
      localStorage.removeItem('token');
      setError(err.response?.data?.detail || err.message || 'Registration failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Google Sign-in ── */
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      setToken(token);

      // Check if user is already registered in MongoDB
      try {
        const userRes = await api.get('/auth/me');
        const { role: userRole, phone_number } = userRes.data;

        localStorage.setItem('user_role', userRole);
        localStorage.setItem('user_phone', phone_number);
        window.dispatchEvent(new Event('storage'));

        if (userRole === 'SELLER') navigate('/dashboard/seller');
        else if (userRole === 'ADMIN') navigate('/dashboard/admin');
        else navigate('/dashboard/buyer');
      } catch (err: any) {
        // If auth fails on backend, they exist in Firebase Auth but NOT MongoDB.
        // We prompt them to complete their profile (select role and input phone).
        setSocialUid(firebaseUser.uid);
        setSocialEmail(firebaseUser.email || '');
        setSocialName(firebaseUser.displayName || '');
        setStep('social-complete');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Complete Social Register Profile ── */
  const handleSocialComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError('Please select a role (Buyer or Seller).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', {
        uid: socialUid,
        email: socialEmail,
        phone_number: socialPhone,
        role,
        full_name: socialName,
      });

      localStorage.setItem('user_role', role);
      localStorage.setItem('user_phone', socialPhone);
      window.dispatchEvent(new Event('storage'));

      if (role === 'SELLER') navigate('/dashboard/seller');
      else navigate('/dashboard/buyer');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to complete profile registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #f0f9ff 100%)' }}>

      {/* Decorative blobs */}
      <div style={{
        position: 'fixed', top: '-10rem', right: '-10rem', width: '30rem', height: '30rem',
        background: 'radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-8rem', left: '-8rem', width: '24rem', height: '24rem',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div className="auth-card fade-in" style={{ width: '100%', maxWidth: '420px', borderRadius: '20px', padding: '2.5rem' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            marginBottom: '1rem', boxShadow: '0 8px 20px rgba(22,163,74,0.25)'
          }}>
            {/* SVG pin icon */}
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>TERRITORY</h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>Land marketplace you can trust</p>
        </div>

        {/* ── Step: Login ── */}
        {step === 'login' && (
          <div className="slide-in">
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Welcome back</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem' }}>Sign in to access your account</p>
            {error && <div className="error-box" style={{ marginBottom: '1rem' }}>{error}</div>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Email Address</label>
                <input id="login-email" className="form-input" type="email" required placeholder="name@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Password</label>
                <input id="login-password" className="form-input" type="password" required placeholder="Your password"
                  value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button id="login-submit" type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem' }}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Google Sign-in Button */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ padding: '0 0.75rem', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '0.75rem',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                background: '#fff',
                color: '#334155',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.6 5.6 0 0 1 8.39 13a5.6 5.6 0 0 1 5.602-5.6c1.472 0 2.822.544 3.864 1.44l3.184-3.184C18.99 3.737 16.63 2.8 13.992 2.8 8.358 2.8 3.8 7.36 3.8 13s4.558 10.2 10.192 10.2c5.952 0 9.877-4.185 9.877-10.05 0-.682-.075-1.2-.218-1.865H12.24Z" />
              </svg>
              Continue with Google
            </button>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Don't have an account?</p>
              <button id="go-create-account" onClick={() => { setStep('choose-role'); setError(''); }}
                style={{ marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>
                Create Account →
              </button>
            </div>
          </div>
        )}

        {/* ── Step: Choose Role ── */}
        {step === 'choose-role' && (
          <div className="slide-in">
            <button onClick={() => { setStep('login'); setError(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ← Back to login
            </button>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Create your account</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem' }}>What best describes you?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div id="choose-buyer" className={`role-card${role === 'BUYER' ? ' selected' : ''}`} onClick={() => setRole('BUYER')}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏠</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Buyer</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Browse & purchase land</div>
              </div>
              <div id="choose-seller" className={`role-card${role === 'SELLER' ? ' selected' : ''}`} onClick={() => setRole('SELLER')}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Seller</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>List & sell your land</div>
              </div>
            </div>
            <button id="continue-with-role" disabled={!role} className="btn-primary"
              onClick={() => { if (role) { setStep('register'); setError(''); } }}>
              Continue as {role ? (role === 'BUYER' ? 'Buyer' : 'Seller') : '...'}
            </button>
          </div>
        )}

        {/* ── Step: Register Form ── */}
        {step === 'register' && (
          <div className="slide-in">
            <button onClick={() => { setStep('choose-role'); setError(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              ← Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{role === 'BUYER' ? '🏠' : '📋'}</span>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {role === 'BUYER' ? 'Buyer' : 'Seller'} Account
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem' }}>Fill in your details to get started</p>
            {error && <div className="error-box" style={{ marginBottom: '1rem' }}>{error}</div>}
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Full Name</label>
                <input id="reg-name" className="form-input" type="text" required placeholder="Your full name"
                  value={regName} onChange={e => setRegName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Email Address</label>
                <input id="reg-email" className="form-input" type="email" required placeholder="name@example.com"
                  value={regEmail} onChange={e => setRegEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Phone Number</label>
                <input id="reg-phone" className="form-input" type="tel" required placeholder="10-digit phone number"
                  value={regPhone} onChange={e => setRegPhone(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Password</label>
                <input id="reg-password" className="form-input" type="password" required placeholder="Min. 6 characters"
                  value={regPassword} onChange={e => setRegPassword(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Confirm Password</label>
                <input id="reg-confirm" className="form-input" type="password" required placeholder="Repeat password"
                  value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
              </div>
              <button id="register-submit" type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem' }}>
                {loading ? 'Creating account…' : `Create ${role === 'BUYER' ? 'Buyer' : 'Seller'} Account`}
              </button>
            </form>
          </div>
        )}

        {/* ── Step: Social Completion Form (for Google Auth new users) ── */}
        {step === 'social-complete' && (
          <div className="slide-in">
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Complete registration</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem' }}>Select your role and phone number to complete signup.</p>
            {error && <div className="error-box" style={{ marginBottom: '1rem' }}>{error}</div>}
            
            <form onSubmit={handleSocialComplete} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Choose your role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className={`role-card${role === 'BUYER' ? ' selected' : ''}`} style={{ padding: '1rem' }} onClick={() => setRole('BUYER')}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🏠</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>Buyer</div>
                  </div>
                  <div className={`role-card${role === 'SELLER' ? ' selected' : ''}`} style={{ padding: '1rem' }} onClick={() => setRole('SELLER')}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📋</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>Seller</div>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Phone Number</label>
                <input
                  className="form-input"
                  type="tel"
                  required
                  placeholder="10-digit phone number"
                  value={socialPhone}
                  onChange={e => setSocialPhone(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loading || !role} className="btn-primary" style={{ marginTop: '0.5rem' }}>
                {loading ? 'Completing profile…' : 'Complete Setup'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
