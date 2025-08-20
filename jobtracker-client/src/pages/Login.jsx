import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setMessage('Login successful! Redirecting...');

      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <h2 className="gradient-heading" style={{ fontSize: '2.5rem', textAlign: 'center' }}>Login</h2>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '300px',
        margin: '2rem auto'
      }}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{ marginTop: '1rem' }}>Login</button>
      </form>

      {message && (
        <p style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: message.includes('success') ? '#9ae6b4' : '#f87171',
          fontWeight: 'bold'
        }}>{message}</p>
      )}
      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <span
          onClick={() => navigate('/register')}
          style={{
            color: '#3b82f6',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          Don't have an account? Register
        </span>
      </p>
      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <span
          onClick={() => navigate('/')}
          style={{
            color: '#4DA8DA',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          Go to Home
        </span>
      </p>
    </div>
  );
}

export default Login;
