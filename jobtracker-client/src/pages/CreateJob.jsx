import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import '../styles/common.css';

function CreateJob() {
  const [form, setForm] = useState({
    title: '',
    company: '',
    notes: '',
    deadline: ''
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/jobs',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('✅ Job created!');
      navigate('/admin-dashboard');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to create job');
    }
  };

  return (
    <div className="container">
      <div className="header-section">
        <h2 className="gradient-heading" style={{ fontSize: '2.2rem' }}>Create a New Job</h2>
        <LogoutButton />
      </div>

      <form onSubmit={handleCreate} className="form-container">
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
          required
        />

        <button type="submit">Create Job</button>
      </form>
    </div>
  );
}

export default CreateJob;