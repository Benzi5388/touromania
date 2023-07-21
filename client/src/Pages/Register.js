import React, { useState, useEffect } from 'react';
import { MDBCard, MDBCardBody, MDBInput, MDBCardFooter, MDBValidation, MDBIcon, MDBSpinner, MDBBtn } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { register } from '../Redux/Features/authSlice';
import axios from 'axios';
import Header from '../Components/Header';
import '../App.css'
import loginanimation from "../Assets/loginanimation.json"
import Lotie from 'lottie-react'
import API from '../Axios/Api'

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  isPremium: false

}
function Register() {
  const [formValue, setFormValue] = useState(initialState)
  const { loading, error } = useSelector((state) => ({ ...state.auth }))
  const { email, password, firstName, lastName, confirmPassword, isPremium } = formValue;
  const user = useSelector((state) => (state.auth.user))
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    error && toast.error(error)
  }, [error]);

  useEffect(() => {
    if (user?.login===false) {
      navigate('/register'); // Navigate to the home route
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return toast.error("Passwords dont match")
    }
    if (email && password && firstName && lastName) {
      console.log("hishaoijsiaojs")
      console.log(formValue, "fffffffff");
      dispatch(register(formValue));
      const response = await API.post('/users/signup', { formValue }).catch((err) => console.log(err))
      if (response) {
        console.log(response.data);
        navigate('/otp')
        toast.success("Otp sent successfully")
      }
    }
  }


  console.log(user, "home page user");
  const onInputChange = (e) => {
    let { name, value } = e.target
    setFormValue({ ...formValue, [name]: value })
  }
  return (
    <>
      <Header />
      <div className="header-container">
        <MDBCard alignment='center'><div className="animation-container">
          <Lotie animationData={loginanimation} className="login-animation" />
        </div>

          {/* <MDBIcon fas icon = "user-circle" className='fa-2x'></MDBIcon> */}
          <h5>Sign Up</h5>
          <MDBCardBody>
            <MDBValidation onSubmit={handleSubmit} noValidate className='row g-3'>
              <div className="col-md-6">
                <MDBInput label='First Name'
                  type='text'
                  value={firstName}
                  name='firstName'
                  onChange={onInputChange}
                  required
                  invalid
                  validation="Please fill your first name"
                />
              </div>
              <div className="col-md-6">
                <MDBInput label='Last Name'
                  type='text'
                  value={lastName}
                  name='lastName'
                  onChange={onInputChange}
                  required
                  invalid
                  validation="Please fill your last name"
                />
              </div>
              <div className="col-md-12">
                <MDBInput label='email'
                  type='email'
                  value={email}
                  name='email'
                  onChange={onInputChange}
                  required
                  invalid
                  validation="Please provide an email"
                />
              </div>
              <div className="col-md-12">
                <MDBInput label='password'
                  type='password'
                  value={password}
                  name='password'
                  onChange={onInputChange}
                  required
                  invalid
                  validation="choose a password" />
              </div>
              <div className="col-md-12">
                <MDBInput label='confirm password'
                  type='password'
                  value={confirmPassword}
                  name='confirmPassword'
                  onChange={onInputChange}
                  required
                  invalid
                  validation="Please reconfirm your password" />
              </div>
              <div className="col-12">
                <MDBBtn className='mt-2 login-btn' >
                  {loading && (
                    <MDBSpinner
                      size='sm'
                      role='status'
                      tag='span'
                      className='me-2'
                    />
                  )}
                  Register
                </MDBBtn>
              </div>
            </MDBValidation>
          </MDBCardBody>
          <MDBCardFooter>
            <Link to="/login">
              <p>Already have an account? Sign in</p>
            </Link>
          </MDBCardFooter>
        </MDBCard>
      </div>
    </>
  )
}

export default Register