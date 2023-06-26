import React , {useEffect} from 'react';
import './App.css';
import {ToastContainer} from 'react-toastify';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Otp from './Pages/Otp';
import ForgotPassword from './Pages/Forgotpassword';
import ResetPassword from './Pages/ResetPassword';
import { useDispatch } from 'react-redux';
import { register, saveUserData} from './Redux/Features/authSlice';
import AddEditTour from './Pages/AddEditTour';
import AdminLogin from './Pages/AdminLogin'
import AdminHome from './Pages/AdminHome';
import Users from './Pages/Users';
import axios from 'axios';
import ResendOTP from './Pages/ResendOTP'
import VerifyOtp from './Pages/VerifyOtp';

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
      dispatch(register({email:email}));
    }
  }, [dispatch]);

  return (
   <BrowserRouter>
     <div className='App'>
      <ToastContainer/>
      <Routes>
        <Route path = '/' element = {<Home/>}/>
        <Route path = '/login' element = {<Login/>}/>
        <Route path = '/register' element = {<Register/>}/>
        <Route path = '/otp' element = {<Otp />}/>
        <Route path = '/resetPassword' element = {<ResetPassword/>}/>
        <Route path = '/forgotPassword' element = {<ForgotPassword/>}/>
        <Route path = '/addTour' element = {<AddEditTour/>}/>
        <Route path = '/editTour/:id' element = {<AddEditTour/>}/>
        <Route path="/resendOTP" element={<ResendOTP />} />
        <Route path='/verifyOTP' element={<VerifyOtp/>} />
        <Route path='/adminlogin' element={<AdminLogin/>} />
        <Route path='/adminhome' element={<AdminHome/>} />
        <Route path="/users" element={<Users/>} />
        <Route path = '/adminhome/:id' element = {<AdminHome/>}/>

      </Routes>
      </div>
   </BrowserRouter>
  )
}

export default App