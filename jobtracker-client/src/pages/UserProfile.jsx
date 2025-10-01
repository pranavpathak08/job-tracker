import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/Profile.css';

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

  if (!user) return <p className="loading-text">Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="header-section">
        <h2 className="gradient-heading profile-heading">
          User Profile
        </h2>
        <div className="button-group">
          <button className="button" onClick={() => navigate('/dashboard')}>
            ⬅️ Back to Dashboard
          </button>
          <button className="button" onClick={() => navigate('/edit-profile')}>
            ✏️ Edit Profile
          </button>
          <LogoutButton />
        </div>
      </div>

      <div className="profile-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Currently Doing:</strong> {user.currentlyDoing || '—'}</p>
        <p><strong>About:</strong> {user.about || '—'}</p>
        <p><strong>Experience:</strong> {user.experience || '—'}</p>
        <p><strong>Joined On:</strong> {user.createdAt?.split('T')[0]}</p>
        <p><strong>Location:</strong> {user.place || '—'}</p>
        <p><strong>Company/University:</strong> {user.company || '—'}</p>
      </div>
    </div>
  );
}

export default UserProfile;