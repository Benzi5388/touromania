import React, { useEffect } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Otp from './Pages/Otp';
import ForgotPassword from './Pages/Forgotpassword';
import ResetPassword from './Pages/ResetPassword';
import { useDispatch, useSelector } from 'react-redux';
import { register, saveUserData, reload } from './Redux/Features/authSlice';
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
import Footer from './Components/Footer';
import { setUser } from './Redux/Features/adminSlice';
import { useLocation } from 'react-router-dom';
import API from './Axios/Api'



function App() {
  console.log(API, "appppppppppp");
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();
  const email = JSON.parse(localStorage.getItem('email'));
  const admin = useSelector((state) => (state.admin.user))
  const user = useSelector((state) => (state.auth.user))
  const refresh = useSelector(state=>state.tour.refresh)
  const navigate = useNavigate()
  const location = useLocation();
  

  useEffect(() => {
    (async function () {
      try{
        const { data } = await API.get("/users/login/check");
     
      const exemptedRoutes = [ '/register', '/forgotPassword', '/resetPassword', '/otp','/verifyOTP','/resendOTP'];
      if (exemptedRoutes.includes(location.pathname)) {
        return; // Skip the login check for these routes
      }
      if (data.loggedIn && data.userData) {
        dispatch(saveUserData({ ...data.userData, id: data.userData._id, login: true }))
      } else {
        dispatch(saveUserData({ login: false }))
      }
      const { data: adminData } = await API.get("/admin/login/check");
      console.log(adminData)
      if (adminData.loggedIn && adminData.adminData) {
        dispatch(setUser({ user: { ...adminData.adminData, login: true } }))
      } else {
        dispatch(setUser({ user: { login: false } }))
      }
      // if(!data.loggedIn){
      //   navigate("/login")
      // }else{
      //   if(data.userData ){
      //     dispatch(saveUserData({...data.userData, id:data.userData._id}))
      //   }
      // }
    }catch(err){
      console.log(err)
    }
    })()

  }, [dispatch,navigate, location, refresh]);

  // useEffect(()=>{
  //   if(user)
  //   dispatch(setUser({user:user}))
  // },[])

  useEffect(() => {

    if (email) {
      dispatch(register({ email: email }));
    }
  }, []);

  return (

    <div className='App'>

      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/otp' element={<Otp />} />
        <Route path='/resetPassword' element={<ResetPassword />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path="/editTour/:id" element={<EditTour />} />
        <Route path="/addTour" element={<AddTour />} />
        <Route path='/tour/:id' element={<SingleTour />} />
        <Route path='/admin/:id' element={<Description />} />
        <Route path="/resendOTP" element={<ResendOTP />} />
        <Route path='/verifyOTP' element={<VerifyOtp />} />
        <Route path='/tours' element={<Tours />} />
        <Route path='/AdminDashboard' element={<AdminDashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path='/tours/:id' element={<Tours />} />
        <Route path='/UserDashboard' element={<UserDashboard />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/callback' element={<UserAuth />} />
        <Route path='/adminLogin' element={<AdminLogin />} />
        <Route path='/AdminDashboard' element={<AdminDashboard />} />

        {
        //   admin?.user?.login &&
        //   <>
        //     <Route path='/adminLogin' element={<Navigate to="/AdminDashboard" />} />
        //     {/* <Route path='/AdminDashboard' element={<AdminDashboard />} /> */}
            
        //   </>
        // }
        // {
        //   admin?.user?.login === false &&
        //   <>
        //     <Route path='/adminLogin' element={<AdminLogin />} />
        //     {/* <Route path='/AdminDashboard' element={<Navigate to="/adminLogin" />} /> */}
            
        //   </>
        }
      </Routes>
    </div>
  )
}

export default App