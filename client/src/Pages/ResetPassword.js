import React, { useState, useEffect } from 'react';
import { MDBCard, MDBCardBody, MDBInput, MDBCardFooter, MDBValidation, MDBIcon, MDBSpinner, MDBBtn } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Header from '../Components/Header';
import loginanimation from "../Assets/loginanimation.json"
import Cookies from 'js-cookie';
import Lotie from 'lottie-react'
import '../App.css'
import jwt_decode from 'jwt-decode';
import API from '../Axios/Api'


const initialState = {
  password: "",
  resetPassword: ""
}
function ResetPassword() {
  const [formValue, setFormValue] = useState(initialState)
  const { loading, error } = useSelector((state) => ({ ...state.auth }))
  const { password, confirmPassword } = formValue;
  const email = Cookies.get('email');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
 console.log(email);
  useEffect(() => {
    error && toast.error(error)
  }, [error]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && confirmPassword) {
      try {
        const response = await API.post('/users/resetPassword', {
          password,
          confirmPassword,
          email
        });
        if (response) {
          navigate('/login');
          toast.success("Password reset successfully!!");
        }
      } catch (error) {
        toast.error("Error resetting password");
      }
    }
  };

  const onInputChange = (e) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  return (
    <>
      <Header />
      <div className='header-container'>

        <MDBCard alignment='center'>
          <div className="animation-container">
            <div className="animation-container">
              <Lotie animationData={loginanimation} className="login-animation" />
            </div>
          </div>
          <h5>Reset Password</h5>
          <MDBCardBody>
            <MDBValidation onSubmit={handleSubmit} noValidate className='row g-3'>
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
                <MDBBtn className='mt-2 login-btn'>
                  {loading && (
                    <MDBSpinner
                      size='sm'
                      role='status'
                      tag='span'
                      className='me-2'
                    />
                  )}
                  Submit
                </MDBBtn>
              </div>
            </MDBValidation>
          </MDBCardBody>
          <MDBCardFooter>
            <Link to="/login">
            </Link>
          </MDBCardFooter>
        </MDBCard>
      </div>
    </>
  )
}

export default ResetPassword;