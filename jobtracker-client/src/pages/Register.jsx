import { useState } from "react";
import axios from "axios";  
import { useNavigate } from "react-router-dom";
import "../styles/common.css"


export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (evt) => {
    setFormData((prev) => {
      return {
        ...prev,
        [evt.target.name]: evt.target.value
      }
    })
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      const userId = res.data?.userId;

      if (!userId) {
        throw new Error("User ID not returned from the server");
      }

      navigate(`/complete-profile/${userId}`);
    } catch (err) {
      console.error("Registration error", err);
      setMessage(err.response?.data?.message || "Registration failed. Please try again.")
    }
  }

  return (
    <div className="container">
      <h2 className="text-center" style={{ fontSize: "2rem" }}>Register</h2>
      
      <form onSubmit={handleSubmit} className="form-centered">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />

        <button type="submit" style={{marginTop: "1rem"}}>
          Next
        </button>
      </form>

      <p className="text-center" style={{marginTop: "1.5rem"}}>
        <span onClick={() => navigate('/login')} className="link">
          Already have an account? Sign in
        </span>
      </p>

      {message && (
        <p className="text-center message-error">
          {message}
        </p>
      )}
    </div>
  )

}

