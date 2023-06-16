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
import Header from './Components/Header';
import { useDispatch } from 'react-redux';
import { setUser } from './Redux/Features/authSlice';
import AddEditTour from './Pages/AddEditTour';


function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
   useEffect(() =>{
      dispatch(setUser(user))
   },[user])
  return (
   <BrowserRouter>
     <div className='App'>
      <Header/>
      <ToastContainer/>
      <Routes>
        <Route path = '/' element = {<Home/>}/>
        <Route path = '/login' element = {<Login/>}/>
        <Route path = '/register' element = {<Register/>}/>
        <Route path = '/otp' element = {<Otp/>}/>
        <Route path = '/resetPassword' element = {<ResetPassword/>}/>
        <Route path = '/forgotPassword' element = {<ForgotPassword/>}/>
        <Route path = '/addTour' element = {<AddEditTour/>}/>
        <Route path = '/editTour/:id' element = {<AddEditTour/>}/>
      </Routes>
      </div>
   </BrowserRouter>
  )
}

export default App