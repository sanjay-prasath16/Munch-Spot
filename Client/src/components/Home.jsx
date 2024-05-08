import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const logout = async () => {
    const { data:responseData } = await axios.get('/logout', {});
    toast.success(responseData.message);
    navigate('/login');
  }
  return (
    <div>
      <h2>Home</h2>
      <Link to="/register"> Register </Link>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Home