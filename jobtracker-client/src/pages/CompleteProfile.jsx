// src/pages/CompleteProfile.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CompleteProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentlyDoing: '',
    about: '',
    experience: '',
    place: '',
    company: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await axios.put(
        `http://localhost:5000/api/auth/complete-profile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tempToken')}`
          }
        }
      );
  
      // ✅ Move temp token → permanent token
      const token = localStorage.getItem('tempToken');
      localStorage.setItem('token', token);
      localStorage.removeItem('tempToken');
  
      navigate('/login');
    } catch (err) {
      console.error('❌ Error completing profile:', err);
    }
  };
  

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center' }}>Complete Your Profile</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', margin: '2rem auto' }}>
        <input type="text" name="currentlyDoing" placeholder="Current Status" value={formData.currentlyDoing} onChange={handleChange} />
        <textarea name="about" placeholder="About You" value={formData.about} onChange={handleChange}></textarea>
        <textarea name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange}></textarea>
        <input type="text" name="place" placeholder="State, Country" value={formData.place} onChange={handleChange} />
        <input type="text" name="company" placeholder="Company / University" value={formData.company} onChange={handleChange} />
        <button type="submit" style={{ marginTop: '1rem' }}>Save & Login</button>
      </form>
    </div>
  );
}

export default CompleteProfile;
