import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import '../styles/common.css';
import '../styles/ViewApplicants.css';

function ViewApplicants() {
  const { jobId } = useParams();
  const { state } = useLocation();
  const token = localStorage.getItem('token');

  const [applicants, setApplicants] = useState([]);

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/applicants/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplicants(res.data.applicants);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchApplicants();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  return (
    <div className="applicants-container">
      <div className="applicants-header">
        <div>
          <h2>
            Applicants for: <span className="applicants-job-title">{state?.jobTitle}</span>
          </h2>
          <h4>
            Company: {state?.company} | Job ID: {jobId}
          </h4>
        </div>
        <LogoutButton />
      </div>

      {applicants.length === 0 ? (
        <p>No applicants found.</p>
      ) : (
        <table className="applicants-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Change Status</th>
              <th>Applied At</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((app) => (
              <tr key={app.applicationId}>
                <td>{app.userId || 'N/A'}</td>
                <td>{app.applicantName}</td>
                <td>{app.status}</td>
                <td>
                  <select
                    value={app.status}
                    onChange={(e) =>
                      updateStatus(app.applicationId, e.target.value)
                    }
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>{app.appliedAt?.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewApplicants;