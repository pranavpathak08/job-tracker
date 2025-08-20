import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';

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
      fetchApplicants(); // Refresh
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  return (
    <div className="container" style={{ padding: '2rem' }}>
    {/* 🧭 Top row: heading + logout aligned using flex */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '1.5rem'
    }}>
      <div>
        <h2 style={{ marginBottom: '0.3rem' }}>
          Applicants for: <span style={{ color: '#a78bfa' }}>{state?.jobTitle}</span>
        </h2>
        <h4 style={{ margin: 0, fontWeight: 'normal', color: '#ccc' }}>
          Company: {state?.company} | Job ID: {jobId}
        </h4>
      </div>
      <LogoutButton />
    </div>

      {applicants.length === 0 ? (
        <p>No applicants found.</p>
      ) : (
        <table>
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
