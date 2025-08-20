import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBuilding } from 'react-icons/fa';

function UserDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        // ✅ Fetch fresh user profile from server
        const userRes = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userRes.data.user);

        // Jobs
        const jobRes = await axios.get('http://localhost:5000/api/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(jobRes.data.jobs);

        // Applications
        const appRes = await axios.get('http://localhost:5000/api/my-applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(appRes.data.applications);
      } catch (err) {
        console.error('❌ Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const applyToJob = async (jobId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `http://localhost:5000/api/apply/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message);

      const appRes = await axios.get('http://localhost:5000/api/my-applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(appRes.data.applications);
    } catch (err) {
      alert(err.response?.data?.message || 'Error applying to job');
    }
  };

  const getApplicationStatus = (jobId) => {
    const application = applications.find((app) => app.jobId === jobId);
    return application ? application.status : null;
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

  const statusLabel = {
    padding: '0.3rem 0.7rem',
    backgroundColor: '#2f855a',
    color: '#f1f1f1',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  };

  return (
    <div style={{ display: 'flex', padding: '2rem', gap: '2rem' }}>
      {/* USER PROFILE CARD */}
      {user && (
        <div
          style={{
            flex: '0 0 300px',
            backgroundColor: '#1f2937',
            color: '#fff',
            padding: '2rem',
            borderRadius: '1rem',
            marginTop: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            height: '400px',
            overflow: 'auto', 
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <FaUserCircle size={80} />
            <h2>{user.name}</h2>
            <p style={{ textAlign: 'center' }}>
              {user.currentlyDoing || 'Not specified'} at {user.company || 'No Company'}
            </p>
            <p style={{ color: '#d1d5db' }}>{user.place || 'Unknown Location'}</p>
            {user.company && (
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9ca3af' }}>
                <FaBuilding /> {user.company}
              </p>
            )}
          </div>
          <button style={{ width: '100%' }} onClick={() => navigate('/profile')}>
            View Profile
          </button>
        </div>
      )}

      {/* JOBS LIST */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ fontSize: '2.5rem' }}>
            <span className="gradient-heading">Welcome, </span> {user?.name}
          </h2>
          <LogoutButton />
        </div>

        <h3 style={{ marginTop: '2rem' }}>Available Jobs</h3>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginTop: '1rem',
          }}
        >
          {jobs.map((job) => {
            const status = getApplicationStatus(job.id);
            return (
              <div
                key={job.id}
                style={{
                  backgroundColor: '#2b2b3c',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  flex: '1 1 300px',
                  boxShadow: '0 0 10px rgba(0,0,0,0.4)',
                }}
              >
                <h4 style={{ color: '#a78bfa' }}>{job.title}</h4>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Deadline:</strong> {job.deadline?.split('T')[0] || 'N/A'}</p>

                <div style={{ marginTop: '1rem' }}>
                  {status ? (
                    <span style={statusLabel}>Status: {status}</span>
                  ) : (
                    <button style={button} onClick={() => applyToJob(job.id)}>
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
