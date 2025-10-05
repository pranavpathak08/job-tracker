import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import JobApplicationModal from "../components/JobApplicationModal";
import { FaBookmark } from "react-icons/fa";
import "../styles/common.css";
import "../styles/SavedJobs.css";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      // Fetch saved jobs
      const savedRes = await axios.get("http://localhost:5000/api/saved-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobs(savedRes.data.savedJobs);

      // Fetch applications to check status
      const appRes = await axios.get("http://localhost:5000/api/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(appRes.data.applications);

    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/unsave-job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Error unsaving job:", err);
      alert("Failed to remove job from saved");
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

  const refreshApplications = async () => {
    const token = localStorage.getItem("token");
    const appRes = await axios.get("http://localhost:5000/api/my-applications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setApplications(appRes.data.applications);
  };

  const getApplicationStatus = (jobId) => {
    const application = applications.find((app) => app.jobId === jobId);
    return application ? application.status : null;
  };

  if (loading) {
    return (
      <div className="container">
        <p className="loading-text">Loading saved jobs...</p>
      </div>
    );
  }

  return (
    <div className="saved-jobs-container">
      <div className="header-section">
        <h2 className="gradient-heading dashboard-heading">
          <FaBookmark style={{ marginRight: "0.5rem" }} />
          Saved Jobs
        </h2>
        <div className="button-group">
          <button className="button" onClick={() => navigate("/dashboard")}>
            ⬅ Back to Dashboard
          </button>
          <LogoutButton />
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-message">
            No saved jobs yet. Start saving jobs you're interested in!
          </p>
          <button className="button" onClick={() => navigate("/dashboard")}>
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {savedJobs.map((job) => {
            const status = getApplicationStatus(job.id);
            return (
              <div key={job.id} className="card saved-job-card">
                <div className="card-header">
                  <h4>{job.title}</h4>
                  <button
                    onClick={() => handleUnsave(job.id)}
                    className="unsave-btn"
                    title="Remove from saved"
                  >
                    <FaBookmark />
                  </button>
                </div>

                <p>
                  <strong>Company:</strong> {job.company}
                </p>
                <p>
                  <strong>Deadline:</strong> {job.deadline?.split("T")[0] || "N/A"}
                </p>
                <p>
                  <strong>Saved On:</strong>{" "}
                  {new Date(job.savedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>

                {job.notes && (
                  <p className="job-notes">
                    <strong>Notes:</strong> {job.notes}
                  </p>
                )}

                <div style={{ marginTop: "1rem" }}>
                  {status ? (
                    <span className="status-label">Status: {status}</span>
                  ) : (
                    <button className="button" onClick={() => openModal(job)}>
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <JobApplicationModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApplied={refreshApplications}
      />
    </div>
  );
}