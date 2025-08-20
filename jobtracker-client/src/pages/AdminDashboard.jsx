import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(res.data.jobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const button = {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    backgroundColor: '#1f2937',
    color: '#f1f1f1',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const buttonDanger = {
    ...button,
    color: '#f87171',
    borderColor: '#f87171',
    backgroundColor: '#3b1f1f',
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <h2 className="gradient-heading" style={{ fontSize: '2.5rem' }}>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={button} onClick={() => navigate('/create-job')}>Create Job</button>
          <LogoutButton />
        </div>
      </div>

      <h3 style={{ marginTop: '2rem' }}>All Jobs</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1rem' }}>
        {jobs.map((job) => (
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

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                style={button}
                onClick={() =>
                  navigate(`/job/${job.id}/applicants`, {
                    state: { jobTitle: job.title, company: job.company },
                  })
                }
              >
                View Applicants
              </button>
              <button
                style={button}
                onClick={() => navigate(`/edit-job/${job.id}`)}
              >
                Edit
              </button>
              <button
                style={buttonDanger}
                onClick={() => handleDelete(job.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
