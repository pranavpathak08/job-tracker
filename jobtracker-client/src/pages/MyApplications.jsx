import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import LogoutButton from "../components/LogoutButton"
import "../styles/common.css"
import "../styles/MyApplications.css"

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem("token");
            
            try {
                const res = await axios.get("http://localhost:5000/api/my-applications", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setApplications(res.data.applications);
            } catch (err) {
                console.error("Error fetching applications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusClass = (status) => {
        switch(status?.toLowerCase()) {
            case 'applied':
                return 'status-applied';
            case 'interviewing':
                return 'status-interviewing';
            case 'offered':
                return 'status-offered';
            case 'rejected':
                return 'status-rejected';
            default:
                return 'status-default';
        }
    };

    if (loading) {
        return <div className="container"><p className="loading-text">Loading applications...</p></div>;
    }

    return (
        <div className="my-applications-container">
            {/* Header Section */}
            <div className="header-section">
                <h2 className="gradient-heading dashboard-heading">My Applications</h2>
                <div className="button-group">
                    <button className="button" onClick={() => navigate("/dashboard")}>
                        ⬅ Back to Dashboard
                    </button>
                    <LogoutButton />
                </div>
            </div>

            {/* Applications Table */}
            {applications.length === 0 ? (
                <div className="empty-state">
                    <p className="empty-state-message">
                        No applications yet. Start applying to jobs!
                    </p>
                    <button 
                        className="button" 
                        onClick={() => navigate("/dashboard")}
                    >
                        Browse Jobs
                    </button>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="applications-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Deadline</th>
                                <th className="text-center">Applied On</th>
                                <th className="text-center">Resume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app, idx) => (
                                <tr key={idx} className="table-row">
                                    <td className="job-title">{app.title}</td>
                                    <td className="company-name">{app.company}</td>
                                    <td className="text-center">
                                        <span className={`status-badge ${getStatusClass(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="text-center deadline">
                                        {app.deadline?.split("T")[0] || "N/A"}
                                    </td>
                                    <td className="text-center applied-date">
                                        {new Date(app.appliedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="text-center">
                                        {app.resumePath ? (
                                            <a 
                                                href={`http://localhost:5000/${app.resumePath}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="resume-link"
                                            >
                                                📄 View
                                            </a>
                                        ) : (
                                            <span className="no-resume">No Resume</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Summary Section */}
            {applications.length > 0 && (
                <div className="summary-section">
                    <div className="summary-card">
                        <p className="summary-number">{applications.length}</p>
                        <p className="summary-label">Total Applications</p>
                    </div>
                    <div className="summary-card">
                        <p className="summary-number summary-offered">
                            {applications.filter(app => app.status?.toLowerCase() === 'offered').length}
                        </p>
                        <p className="summary-label">Offers Received</p>
                    </div>
                    <div className="summary-card">
                        <p className="summary-number summary-interviewing">
                            {applications.filter(app => app.status?.toLowerCase() === 'interviewing').length}
                        </p>
                        <p className="summary-label">Interviews</p>
                    </div>
                    <div className="summary-card">
                        <p className="summary-number summary-applied">
                            {applications.filter(app => app.status?.toLowerCase() === 'applied').length}
                        </p>
                        <p className="summary-label">Pending</p>
                    </div>
                </div>
            )}
        </div>
    );
}