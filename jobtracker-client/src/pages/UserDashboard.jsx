import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBuilding, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import JobApplicationModal from '../components/JobApplicationModal';
import JobNews from '../components/JobNews';
import '../styles/common.css';
import '../styles/Dashboard.css';

function UserDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]); // Track saved job IDs
  const [user, setUser] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        // Fetch user profile
        const userRes = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);

        // Fetch all jobs
        const jobRes = await axios.get('http://localhost:5000/api/jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobRes.data.jobs);

        // Fetch user's applications
        const appRes = await axios.get('http://localhost:5000/api/my-applications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(appRes.data.applications);

        // Fetch saved jobs
        const savedRes = await axios.get('http://localhost:5000/api/saved-jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedJobs(savedRes.data.savedJobs.map(job => job.id));

      } catch (err) {
        console.error('❌ Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const refreshApplications = async () => {
    const token = localStorage.getItem("token");
    const appRes = await axios.get("http://localhost:5000/api/my-applications", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setApplications(appRes.data.applications);
  };

  const handleSaveJob = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
      if (savedJobs.includes(jobId)) {
        // Unsave
        await axios.delete(`http://localhost:5000/api/unsave-job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs(savedJobs.filter(id => id !== jobId));
      } else {
        // Save
        await axios.post(`http://localhost:5000/api/save-job/${jobId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs([...savedJobs, jobId]);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
      alert(err.response?.data?.message || 'Error saving job');
    }
  };

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  const getApplicationStatus = (jobId) => {
    const application = applications.find((app) => app.jobId === jobId);
    return application ? application.status : null;
  };

  return (
    <div className="user-dashboard-container">
      <div className="sidebar-section">
        {user && (
          <div className="user-profile-card">
            <div className="user-profile-header">
              <FaUserCircle size={80} />
              <h2>{user.name}</h2>
              <p>
                {user.currentlyDoing || "Not specified"} at{" "}
                {user.company || "No Company"}
              </p>
              <p className="user-profile-location">
                {user.place || "Unknown Location"}
              </p>
              {user.company && (
                <p className="user-profile-company">
                  <FaBuilding /> {user.company}
                </p>
              )}
            </div>
            <button onClick={() => navigate("/profile")}>View Profile</button>
          </div>
        )}

        {/* Buttons Below Profile Card */}
        <div className="quick-actions">
          <button 
            className="action-button" 
            onClick={() => navigate('/my-applications')}
          >
            📋 My Applications
            <span className="badge">{applications.length}</span>
          </button>
          <button 
            className="action-button" 
            onClick={() => navigate('/saved-jobs')}
          >
            🔖 Saved Jobs
            <span className="badge">{savedJobs.length}</span>
          </button>
        </div>
        <JobNews />
      </div>

      <div className="user-dashboard-jobs">
        <div className="header-section">
          <h2 className="dashboard-heading">
            <span className="gradient-heading">Welcome, </span> {user?.name}
          </h2>
          <LogoutButton />
        </div>

        <h3 className="dashboard-section-title">Available Jobs</h3>

        <div className="card-grid">
          {jobs.map((job) => {
            const status = getApplicationStatus(job.id);
            const isSaved = savedJobs.includes(job.id);
            
            return (
              <div key={job.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h4>{job.title}</h4>
                  <button
                    onClick={() => handleSaveJob(job.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      color: isSaved ? '#f59e0b' : '#6b7280',
                      padding: '0',
                      transition: 'color 0.2s ease'
                    }}
                    title={isSaved ? 'Unsave job' : 'Save job'}
                  >
                    {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                </div>
                <p>
                  <strong>Company:</strong> {job.company}
                </p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {job.deadline?.split("T")[0] || "N/A"}
                </p>

                <div style={{ marginTop: "1rem" }}>
                  {status ? (
                    <span className="status-label">Status: {status}</span>
                  ) : (
                    <button className="button" onClick={() => openModal(job)}>
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <JobApplicationModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApplied={refreshApplications}
      />
    </div>
  );
}

export default UserDashboard;