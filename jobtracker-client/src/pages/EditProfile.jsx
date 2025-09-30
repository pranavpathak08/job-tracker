import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    currentlyDoing: '',
    about: '',
    experience: '',
    place: '',
    company: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = res.data.user;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          currentlyDoing: userData.currentlyDoing || '',
          about: userData.about || '',
          experience: userData.experience || '',
          place: userData.place || '',
          company: userData.company || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching profile:', err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      await axios.put(`http://localhost:5000/api/edit-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setMessage('✅ Profile updated successfully!');
      
      // Update localStorage user data
      const updatedUser = { ...JSON.parse(localStorage.getItem('user')), name: formData.name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      setMessage('❌ Failed to update profile. Please try again.');
    }
  };

  const button = {
    padding: '0.4rem 0.9rem',
    fontSize: '0.9rem',
    backgroundColor: '#1f2937',
    color: '#f1f1f1',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    cursor: 'pointer',
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading profile...</p>;

  return (
    <div className="container" style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '1.5rem',
      }}>
        <h2 className="gradient-heading" style={{ fontSize: '2rem' }}>
          Edit Profile
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={button} onClick={() => navigate('/profile')}>
            ⬅️ Back to Profile
          </button>
          <LogoutButton />
        </div>
      </div>

      {/* Edit Form */}
      <div style={{
        backgroundColor: '#2b2b3c',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.4)',
        maxWidth: '700px'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Currently Doing</label>
            <input
              type="text"
              name="currentlyDoing"
              placeholder="e.g., Software Engineer, Student"
              value={formData.currentlyDoing}
              onChange={handleChange}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>About</label>
            <textarea
              name="about"
              placeholder="Tell us about yourself..."
              rows={4}
              value={formData.about}
              onChange={handleChange}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Experience</label>
            <textarea
              name="experience"
              placeholder="Describe your work experience..."
              rows={4}
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Location</label>
            <input
              type="text"
              name="place"
              placeholder="e.g., New York, USA"
              value={formData.place}
              onChange={handleChange}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Company/University</label>
            <input
              type="text"
              name="company"
              placeholder="e.g., Google, Harvard University"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem' }}>
            Update Profile
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: '1rem',
            textAlign: 'center',
            color: message.includes('✅') ? '#9ae6b4' : '#f87171',
            fontWeight: 'bold'
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default EditProfile;