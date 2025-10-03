import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../styles/common.css"

export default function MyApplications() {

    const [applications, setApplications] = useState([]);
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
            }
        };

        fetchApplications();
    }, []);

    return (
        <div className="page-container">
          <h2 className="dashboard-heading">My Applications</h2>
          <button className="button" onClick={() => navigate("/dashboard")}>
            ⬅ Back to Dashboard
          </button>
    
          <div className="card-grid">
            {applications.length === 0 ? (
              <p>No applications yet.</p>
            ) : (
              applications.map((app, idx) => (
                <div key={idx} className="card">
                  <h4>{app.title}</h4>
                  <p><strong>Company:</strong> {app.company}</p>
                  <p><strong>Deadline:</strong> {app.deadline?.split("T")[0] || "N/A"}</p>
                  <p><strong>Status:</strong> {app.status}</p>
                  <p><strong>Applied At:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
    
                  {app.resumePath ? (
                    <a 
                      className="button"
                      href={`http://localhost:5000/${app.resumePath}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  ) : (
                    <p>No resume uploaded</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      );
}