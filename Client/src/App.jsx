import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from '../context/UserContext'
import './App.css'

axios.defaults.baseURL = import.meta.env.REACT_APP_LOCALHOST_URL;
axios.defaults.withCredentials = true;

function App() {

  return (
    <BrowserRouter>
      <UserContextProvider>
        <Toaster position='top-center' toastOptions={{duration: 2000}} />
        <Routes>
          <Route path='/register' element={<Signup />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/' element={<Home />}></Route>
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  )
}

export default App
