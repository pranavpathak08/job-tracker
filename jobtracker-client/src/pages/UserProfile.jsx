import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const [user, setUser] = useState(null);
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
        setUser(res.data.user);
      } catch (err) {
        console.error('❌ Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const button = {
    padding: '0.4rem 0.9rem',
    fontSize: '0.9rem',
    backgroundColor: '#1f2937',
    color: '#f1f1f1',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    cursor: 'pointer',
  };

  if (!user) return <p style={{ padding: '2rem' }}>Loading profile...</p>;

  return (
    <div className="container" style={{ padding: '2rem' }}>
      {/* Header with buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '1.5rem',
      }}>
        <h2 className="gradient-heading" style={{ fontSize: '2rem' }}>
          User Profile
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={button} onClick={() => navigate('/dashboard')}>
            ⬅️ Back to Dashboard
          </button>
          <LogoutButton />
        </div>
      </div>

      {/* Profile card */}
      <div style={{
        backgroundColor: '#2b2b3c',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.4)',
        maxWidth: '700px'
      }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Currently Doing:</strong> {user.currentlyDoing || '—'}</p>
        <p><strong>About:</strong> {user.about || '—'}</p>
        <p><strong>Experience:</strong> {user.experience || '—'}</p>
        <p><strong>Joined On:</strong> {user.createdAt?.split('T')[0]}</p>
      </div>
    </div>
  );
}

export default UserProfile;
