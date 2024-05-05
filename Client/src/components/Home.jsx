import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const logOut = () => {
    window.localStorage.clear()
    navigate('/login');
  }
  return (
    <div>
      <h2>Home</h2>
      <Link to="/register"> Register </Link>
      <button onClick={logOut}>Logout</button>
    </div>
  )
}

export default Home