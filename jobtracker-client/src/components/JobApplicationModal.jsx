import axios from "axios";
import { useState } from "react";
import "../styles/Modal.css"; 

export default function JobApplicationModal({ job, isOpen, onClose, onApplied }) {
    const [resume, setResume] = useState(null);
    const [uploading, setUploading] = useState(false);

    if (!isOpen || !job) return null;

    const handleFileChange = (evt) => {
        setResume(evt.target.files[0]);
    };

    const handleApply = async () => {
        if (!resume) return;
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("resume", resume);

        try {
            setUploading(true);
            const res = await axios.post(
                `http://localhost:5000/api/apply/${job.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            alert(res.data.message);
            onApplied();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Error applying to job");
            
        } finally {
            setUploading(false);
        }
    }

    
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{job.title}</h2>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Deadline:</strong> {job.deadline?.split("T")[0]}</p>
                <p><strong>Notes:</strong> {job.notes || "No additional info"}</p>

                <div style={{ marginTop: "1rem" }}>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                </div>

                <div className="modal-actions">
                <button onClick={onClose}>Cancel</button>
                <button
                    disabled={!resume || uploading}
                    onClick={handleApply}
                    className="apply-btn"
                >
                    {uploading ? "Applying..." : "Apply"}
                </button>
                </div>
            </div>
        </div>
    )
}