  import React, { useState } from 'react';
  import { FaUser } from "react-icons/fa6";
  import { TbLock } from "react-icons/tb";
  import { HiEye, HiEyeOff } from "react-icons/hi";
  import { FcGoogle } from "react-icons/fc";
  import FacebookSvg from '../assets/SVG/FacebookSvg';
  import Twitter from '../assets/SVG/Twitter';
  import Linkedin from '../assets/SVG/Linkedin';
  import SignupImage from '../assets/images/signup.png'
  import axios from 'axios'
  import { Link, useNavigate } from 'react-router-dom';
  import { toast } from 'react-hot-toast';
  import '../components/Signup.css'

  const Login = () => {
      const [data, setData] = useState({
        username: '',
        password: ''
      })
      const [showPassword, setShowPassword] = useState(false);
      const navigate = useNavigate();

      const loginUser = async (e) => {
        e.preventDefault();
        const { username, password } = data;
        try {
          const { data:responseData } = await axios.post('/login', {
            username, 
            password
          });
          if(responseData.err) {
            toast.error(responseData.err)
          } else {
            toast.success('Welcome Back!Lets pick up where you left off.')
            if (responseData.role === 'admin') {
              navigate('/dashboard');
            } else {
              navigate('/');
            }
          }
        } catch(err) {
          console.log(err);
        }
      };

      const googleAuthenticate = (e) => {
        e.preventDefault();
        // Redirect the user to the Google OAuth flow
        window.location.href = 'http://localhost:3001/auth/google';
    };    

      const showpassword = () => {
        setShowPassword(!showPassword);
        const updatedIconColor = [...iconColor];
        updatedIconColor[1].type = showPassword? 'password' : 'text';
        setIconColor(updatedIconColor);
      }

      const handleInputChange = (event) => {
        const { id, value } = event.target;
        setData(prevData => ({
            ...prevData,
            [id]: value
        }));
      };

      const [iconColor, setIconColor ] = useState([
          {icon: <FaUser />, colorClass: 'text-gray-600', iconColor: false, label: 'Username', type: 'text', id: 'username'},
          {icon: <TbLock />, colorClass: 'text-gray-600', iconColor: false, label: 'Password', type: 'password', id: 'password'}
      ]);

      const inputClicked = (index) => {
          const updatedIconColor = [...iconColor];
          updatedIconColor[index].iconColor = true;
          setIconColor(updatedIconColor);
      }

      const inputNotClicked = (index) => {
          const updatedIconColor = [...iconColor];
          updatedIconColor[index].iconColor = false;
          setIconColor(updatedIconColor);
      }

      return (
        <div className='text-sm flex justify-center items-center h-screen customsm:overflow-hidden'>
          <div className="w-full flex justify-center items-center h-screen xl:w-1/2">
            <div className="border-2 border-customBorderPurple rounded-3xl text-start  customsm:border-none" style={{ width: "450px", height: "570px", padding: '10px 70px' }}>
              <h1 className="mt-14 font-semibold text-xl text-center">Get More Access</h1>
              <form action="" className="mt-6">
                {iconColor.map((item, index) => (
                  <div key={index} className='container'>
                    <div className='relative mt-6'>
                      <input
                        type={item.type}
                        value={data[item.id]}
                        className={`input ${data[item.id] ? 'border-customInputBorderPurple' : ''}`}
                        onFocus={() => inputClicked(index)}
                        onBlur={() => inputNotClicked(index)}
                        onChange={(event) => {
                          handleInputChange(event, item.id);
                          switch (item.id) {
                              case 'username':
                                setData(prevData => ({ ...prevData, username: event.target.value }));
                                break;
                              case 'password':
                                setData(prevData => ({ ...prevData, password: event.target.value }));
                                break;
                              default:
                                  break;
                          }
                      }}
                      autoComplete='current-password'
                      />
                      {item.id === 'password' && (
                        <div className='absolute top-5 right-2 customsm:left-72'>
                          <span onClick={showpassword} className='text-gray-400 cursor-pointer customsm:ml-auto'>{showPassword ? <HiEye /> : <HiEyeOff />}</span>
                        </div>
                      )}
                      <div className={`label ${data[item.id] ? "has-content" : ""} ${iconColor[index].iconColor ? "text-customIconColor" : ""}`}>
                        <span className='icon'>{item.icon}</span> 
                        <span style={{ marginTop: '-2px' }} className='labelText'>{item.label}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className='flex justify-end mt-2'>
                  <div>
                    <a href="" className='text-customBlue font-medium underline underline-offset-4'>Forgot Password?</a>
                  </div>
                </div>
                <button onClick={loginUser} className='mt-6 border border-customBlue p-2 w-customButtonWidth rounded-xl bg-customBlue text-white font-semibold text-base'>Login</button>
                <div className='mt-2 text-gray-400 text-center'>
                  Not Yet Have an Account?
                  <span className='text-customBlue font-medium underline underline-offset-4 cursor-pointer'>
                    <Link to="/register" >Register</Link>
                  </span>
                </div>
                <p className='mt-5 text-gray-400 text-center'>Or Login With:</p>
                <ol className='flex justify-between mt-4'>
                  <button className='border border-customBorderPurple p-3 rounded-xl' onClick={googleAuthenticate}><FcGoogle className='w-8 h-8 cursor-pointer'/></button>
                  <li className='border border-customBorderPurple p-3 rounded-xl cursor-pointer'><FacebookSvg /></li>
                  <li className='border border-customBorderPurple p-3 rounded-xl cursor-pointer'><Twitter /></li>
                  <li className='border border-customBorderPurple p-3 rounded-xl cursor-pointer'><Linkedin /></li>
                </ol>
              </form>
            </div>
          </div>
          <div className='w-1/2 hidden xl:block'>
            <img src={SignupImage} alt="" className='h-customSignupHeight mt-10' style={{ marginLeft: '-120px' }} />
          </div>
        </div>
      );
  }

  export default Login