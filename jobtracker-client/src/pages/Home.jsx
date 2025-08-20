import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>LinkedOut</h1>

      <p style={styles.subheading}>
        Track your job applications. Stay organized. Get hired faster.
      </p>

      <div style={styles.buttonContainer}>
        <button onClick={() => navigate('/register')} style={styles.primaryButton}>
          Register
        </button>
        <button onClick={() => navigate('/login')} style={styles.secondaryButton}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#1e1e2f',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'fadeIn 1.2s ease-in-out',
  },
  heading: {
    fontSize: '4rem', // bigger font size
    background: 'linear-gradient(90deg, #a78bfa, #4f46e5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
  },
  subheading: {
    fontSize: '1.25rem',
    color: '#d1d5db',
    maxWidth: '600px',
    marginBottom: '2.5rem',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  secondaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#374151',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  image: {
    maxWidth: '400px',
    marginTop: '2rem',
    opacity: 0.9,
  },
};

export default Home;
