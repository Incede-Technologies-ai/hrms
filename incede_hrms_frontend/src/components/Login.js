import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './login.css'; // Create a CSS file for styling

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
      const { token } = response.data; // Extract token from response
      sessionStorage.setItem('token', token); // Store token in sessionStorage
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Login successful',
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/dashboard');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Invalid credentials'
      });
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src="company-logo.png.png" alt="Company Logo" />
        </div>
      </nav>

      {/* Login Container */}
      <div className="login-container">
        <div className="login-box">
          <h2><i className="fas fa-user-circle"></i> HR Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><i className="fas fa-envelope"></i> Username: </label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="hr@incede"
                required
              />
            </div>
            <div className="form-group">
              <label><i className="fas fa-lock"></i> Password:</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit"><i className="fas fa-sign-in-alt"></i> Login</button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default Login;
