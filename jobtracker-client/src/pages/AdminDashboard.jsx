import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import '../styles/common.css';
import '../styles/Dashboard.css';

export default function AdminDashboard() {
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

  return (
    <div className="container">
      <div className="header-section">
        <h2 className="gradient-heading dashboard-heading">Admin Dashboard</h2>
        <div className="button-group">
          <button className="button" onClick={() => navigate('/create-job')}>Create Job</button>
          <LogoutButton />
        </div>
      </div>

      <h3 className="dashboard-section-title">All Jobs</h3>

      <div className="card-grid">
        {jobs.map((job) => (
          <div key={job.id} className="card">
            <h4>{job.title}</h4>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Deadline:</strong> {job.deadline?.split('T')[0] || 'N/A'}</p>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className="button"
                onClick={() =>
                  navigate(`/job/${job.id}/applicants`, {
                    state: { jobTitle: job.title, company: job.company },
                  })
                }
              >
                View Applicants
              </button>
              <button
                className="button"
                onClick={() => navigate(`/edit-job/${job.id}`)}
              >
                Edit
              </button>
              <button
                className="button button-danger"
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