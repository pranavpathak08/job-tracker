// components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        backgroundColor: '#1f2937',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}
    >
      <h1
        onClick={() => navigate('/admin-dashboard')}
        style={{
          color: '#f1f1f1',
          cursor: 'pointer',
          fontSize: '1.5rem',
          margin: 0,
        }}
      >
        Admin
      </h1>

      <LogoutButton />
    </nav>
  );
}

export default Navbar;
