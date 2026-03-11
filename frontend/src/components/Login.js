import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginWith, setLoginWith] = useState('mobile');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const payload = loginWith === 'mobile'
        ? { mobile, password }
        : { email, password };
      const res = await API.post('/api/auth/login', payload);
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('userId', res.data.userId);
      sessionStorage.setItem('name', res.data.name);
      sessionStorage.setItem('email', res.data.email);
      setIsLoggedIn(true);
      navigate('/chat');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>💬 Aavio Chat</h2>
        <p style={styles.subtitle}>Welcome back!</p>
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.toggle}>
          <button type="button"
            style={loginWith === 'mobile' ? styles.activeToggle : styles.toggleBtn}
            onClick={() => setLoginWith('mobile')}>📱 Mobile</button>
          <button type="button"
            style={loginWith === 'email' ? styles.activeToggle : styles.toggleBtn}
            onClick={() => setLoginWith('email')}>✉️ Email</button>
        </div>

        <form onSubmit={handleLogin}>
          {loginWith === 'mobile' ? (
            <input style={styles.input} type="tel" placeholder="Mobile Number"
              value={mobile} onChange={e => setMobile(e.target.value)} required />
          ) : (
            <input style={styles.input} type="email" placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)} required />
          )}
          <input style={styles.input} type="password" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p style={styles.link}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a2e' },
  box: { background: '#16213e', padding: '40px', borderRadius: '12px', width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  title: { color: '#e94560', textAlign: 'center', marginBottom: '8px' },
  subtitle: { color: '#aaa', textAlign: 'center', marginBottom: '24px' },
  toggle: { display: 'flex', marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #0f3460' },
  toggleBtn: { flex: 1, padding: '10px', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '14px' },
  activeToggle: { flex: 1, padding: '10px', background: '#e94560', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' },
  input: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #0f3460', background: '#0f3460', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  error: { color: '#e94560', textAlign: 'center', marginBottom: '12px' },
  link: { color: '#aaa', textAlign: 'center', marginTop: '16px' }
};

export default Login;