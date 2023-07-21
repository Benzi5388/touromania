import React, { useState, useEffect } from 'react';
import { MDBCard, MDBCardBody, MDBInput, MDBCardFooter, MDBValidation, MDBIcon, MDBSpinner, MDBBtn } from 'mdb-react-ui-kit';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { verify, resendOTP, register } from '../Redux/Features/authSlice';
import axios from 'axios';
import Cookies from 'js-cookie';
import Header from '../Components/Header';
import '../App.css';
import loginanimation from "../Assets/loginanimation.json"
import Lotie from 'lottie-react';
import API from '../Axios/Api'


const initialState = {
    otp: '',
  };

function VerifyOtp() {
    const [formValue, setFormValue] = useState(initialState);
    const email = Cookies.get('email');
  const [isResending, setIsResending] = useState(false);
  const { loading, error } = useSelector((state) => ({ ...state.auth }));
  const [token, setToken] = useState('');
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  console.log(email, "this is the email");
  const { otp } = formValue;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 100);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isResending) {
      console.log('Resend OTP in progress. Submit action blocked.');
      return; // Return early if the resend OTP process is in progress
    }
    if (otp) {
      try {
        try {
          // Call the OTP verification API with the entered OTP
          const response = await API.post('/users/verifyOtp', { email, otp });
  
          // If the OTP is verified successfully
          if (response.status === 200) {
            setIsOTPVerified(true); // Set the OTP verification status to true
            toast.success("OTP verified successfully!");
            navigate('/resetPassword')
          } else {
            toast.error("Incorrect OTP. Please try again.");
          }
        } catch (error) {
          toast.error("Error verifying OTP");
        }
          toast.success("Reset your password");
      } catch (error) {
        toast.error("Incorrect value");
      }
    }
  };
  
  const handleResendOTP = async () => {
    setTimer(10);
    setResendDisabled(true);
    setIsResending(true);
    try {
      const response = await API.post('/users/verifyOtp', { email:email });
      setIsResending(false);
      const { otp } = response.data;
      setFormValue((prevValues) => ({
      ...prevValues,
      otp: otp, // Update the OTP value in the form
    }));
    navigate('/verifyOtp');
      toast.success("Otp sent successfully!!")
    } catch (error) {
      toast.error("Error")
      setIsResending(false);
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <>
    <Header/>
    <div className='header-container'>
      <MDBCard alignment="center">
      <div className="animation-container">
            <Lotie animationData={loginanimation} className="login-animation" />
          </div>
        <h5>OTP</h5>
        <MDBCardBody>
          <MDBValidation onSubmit={handleSubmit} noValidate className="row g-3">
            <div className="col-md-12">
              <p>Please check your email and enter the OTP below!!</p>
              <MDBInput
                label="OTP"
                type="text"
                value={otp}
                name="otp"
                onChange={onInputChange}
                required
                invalid
                validation="Enter the OTP"
              />
            </div>
            <div className="col-12">
              {timer > 0 ? (
                <p>Resend OTP in {timer} seconds</p>
              ) : (
                <MDBBtn style={{ width: '100%' }} onClick={handleResendOTP} disabled={resendDisabled}>
                  Resend OTP
                </MDBBtn>
              )}
            </div>
            <div className="col-12">
              <MDBBtn className="mt-2 login-btn" type="submit" onClick={handleSubmit}>
                {loading ? (
                  <>
                    <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </MDBBtn>
            </div>
          </MDBValidation>
        </MDBCardBody>
        <MDBCardFooter>
          <Link to="/login">Back to Login</Link>
        </MDBCardFooter>
      </MDBCard>
    </div>
    </>
  );
}

export default VerifyOtp