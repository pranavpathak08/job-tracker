import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBuilding } from 'react-icons/fa';
import JobApplicationModal from '../components/JobApplicationModal';
import '../styles/common.css';
import '../styles/Dashboard.css';

function UserDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        const userRes = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userRes.data.user);

        const jobRes = await axios.get('http://localhost:5000/api/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(jobRes.data.jobs);

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

  const refreshApplications = async () => {
    const token = localStorage.getItem("token");
    const appRes = await axios.get("http://localhost:5000/api/my-applications", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setApplications(appRes.data.applications);
  }

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  }

  const getApplicationStatus = (jobId) => {
    const application = applications.find((app) => app.jobId === jobId);
    return application ? application.status : null;
  }

  return (
    <div className="user-dashboard-container">
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
            return (
              <div key={job.id} className="card">
                <h4>{job.title}</h4>
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
  )
}

export default UserDashboard;