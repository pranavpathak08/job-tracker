import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/common.css"

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

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
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setMessage("Login successful! Redirecting")

      if (user.role === 'admin') {
        navigate('/admin-dashboard')
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login Failed")
    }
  }

  return (
    <div className="container">
      <h2 className="gradient-heading text-center" style={{fontSize: "2.5rem"}}>
        Login
      </h2>

      <form onSubmit={handleSubmit} className="form-centered">
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
        />
        <button type="submit" style={{ marginTop: "1rem" }}>Login</button>

        {message && (
          <p
            style={{marginTop: "1rem"}}
            className="{`text-center ${message.includes('success) ? 'message-success' : 'message-error'}`}">
            {message}
          </p>
        )}
        <p className="text-center" style={{ marginTop: "1.5rem" }}>
          <span onClick={() => navigate('/register')} className="link">
            Don't have an account? Register
          </span>
        </p>
        <p className="text-center" style={{marginTop: "1.5rem"}}>
          <span onClick={() => navigate('/')} className="link-secondary link">
            Go to Home
          </span>
        </p>

      </form>
    </div>
  )
}