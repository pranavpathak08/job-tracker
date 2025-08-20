// src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      const userId = res.data?.userId;

      if (!userId) {
        throw new Error("User ID not returned from server.");
      }

      navigate(`/complete-profile/${userId}`);
    } catch (err) {
      console.error("Registration error:", err);
      setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2 style={{ fontSize: '2rem', textAlign: 'center' }}>Register</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: '2rem auto' }}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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
          minLength={6}
        />

        <button type="submit" style={{ marginTop: '1rem' }}>
          Next
        </button>
      </form>

      {message && (
        <p style={{ textAlign: 'center', color: '#f87171' }}>{message}</p>
      )}
    </div>
  );
}

export default Register;
