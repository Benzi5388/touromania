import React, { useEffect } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Otp from './Pages/Otp';
import ForgotPassword from './Pages/Forgotpassword';
import ResetPassword from './Pages/ResetPassword';
import { useDispatch } from 'react-redux';
import { register, saveUserData } from './Redux/Features/authSlice';
import AddTour from './Pages/AddTour';
import AdminLogin from './Pages/AdminLogin'
import Tours from './Pages/Tours';
import Users from './Pages/Users';
import axios from 'axios';
import ResendOTP from './Pages/ResendOTP'
import VerifyOtp from './Pages/VerifyOtp';
import SingleTour from './Pages/SingleTour';
import UserDashboard from './Pages/UserDashboard';
import EditTour from './Pages/EditTour';
import Description from './Pages/Description';
import AdminDashboard from './Pages/AdminDashboard';
import Chat from './Pages/Chat/Chat';
import UserAuth from './Components/UserAuth';


function App() {
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('userData'));
  const email = JSON.parse(localStorage.getItem('email'));

  useEffect(() => {
    if (user) {
      dispatch(saveUserData(user));
    }
  }, [dispatch, user]);

  useEffect(() => {

    if (email) {
      dispatch(register({ email: email }));
    }
  }, [dispatch]);

  return (

    <BrowserRouter>
      <div className='App'>

        <ToastContainer />
        <Routes>
          
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/otp' element={<Otp />} />
          <Route path='/resetPassword' element={<ResetPassword />} />
          <Route path='/forgotPassword' element={<ForgotPassword />} />
          <Route path="/editTour/:id" element={<EditTour/>} />
          <Route path="/addTour" element={<AddTour />} />
          <Route path='/tour/:id' element={<SingleTour />} />
          <Route path='/admin/:id' element={<Description />} />
          <Route path="/resendOTP" element={<ResendOTP />} />
          <Route path='/verifyOTP' element={<VerifyOtp />} />
          <Route path='/adminlogin' element={<AdminLogin />} />
          <Route path='/tours' element={<Tours />} />
          <Route path='/AdminDashboard' element={<AdminDashboard/>} />
          <Route path="/users" element={<Users />} />
          <Route path='/tours/:id' element={<Tours />} />
          <Route path='/UserDashboard' element={<UserDashboard />} />
          <Route path='/chat' element={<Chat/>} />
          <Route path='/callback' element={<UserAuth/>} />


        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App