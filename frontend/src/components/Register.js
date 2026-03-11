import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

function Register() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/auth/register', { name, mobile, email, password });
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Email or mobile may already exist.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>💬 Aavio Chat</h2>
        <p style={styles.subtitle}>Create your account</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input style={styles.input} type="text" placeholder="Full Name"
            value={name} onChange={e => setName(e.target.value)} required />
          <input style={styles.input} type="tel" placeholder="Mobile Number (e.g. +91XXXXXXXXXX)"
            value={mobile} onChange={e => setMobile(e.target.value)} required />
          <input style={styles.input} type="email" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={styles.button} type="submit">Register</button>
        </form>
        <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a2e' },
  box: { background: '#16213e', padding: '40px', borderRadius: '12px', width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  title: { color: '#e94560', textAlign: 'center', marginBottom: '8px' },
  subtitle: { color: '#aaa', textAlign: 'center', marginBottom: '24px' },
  input: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #0f3460', background: '#0f3460', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  error: { color: '#e94560', textAlign: 'center', marginBottom: '12px' },
  link: { color: '#aaa', textAlign: 'center', marginTop: '16px' }
};

export default Register;