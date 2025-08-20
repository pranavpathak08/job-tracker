import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';

function EditJob() {
  const { jobId } = useParams();
  const [form, setForm] = useState({
    title: '',
    company: '',
    notes: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const jobToEdit = res.data.jobs.find(j => j.id === parseInt(jobId));
        if (jobToEdit) {
          setForm({
            title: jobToEdit.title,
            company: jobToEdit.company,
            notes: jobToEdit.notes || '',
            deadline: jobToEdit.deadline?.split('T')[0] || ''
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching job:', err);
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/jobs/${jobId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('✅ Job updated successfully');
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('❌ Error updating job:', err);
      alert('Failed to update job');
    }
  };

  if (loading) return <p className="container" style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div className="container">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '1rem'
      }}>
        <h2 className="gradient-heading" style={{ fontSize: '2.2rem' }}>Edit Job</h2>
        <LogoutButton />
      </div>

      <form onSubmit={handleSubmit} style={{
        maxWidth: '500px',
        marginTop: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={form.company}
          onChange={handleChange}
          required
        />

        <textarea
          name="notes"
          placeholder="Notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
        />

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
        />

        <button type="submit">Update Job</button>
      </form>
    </div>
  );
}

export default EditJob;
