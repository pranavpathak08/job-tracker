import { useNavigate } from "react-router-dom";
import "../styles/Home.css"


export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <h1 className="home-heading">LinkedOut</h1>

      <p className="home-subheading">
        Track your job applications. Stay organised. Get hired faster.
      </p>

      <div className="home-button-container">
        <button onClick={() => navigate('/register')} className="home-primary-button">
          Register
        </button>
        <button onClick={ () => navigate('/login')} className="home-secondary-button">
          Login
        </button>
      </div>

    </div>
  )


}