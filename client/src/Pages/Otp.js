import React, { useState, useEffect } from 'react';
import { MDBCard, MDBCardBody, MDBInput, MDBCardFooter, MDBValidation, MDBIcon, MDBSpinner, MDBBtn } from 'mdb-react-ui-kit';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { verify, resendOTP, register } from '../Redux/Features/authSlice';
import axios from 'axios';
import Header from '../Components/Header';

const initialState = {
  otp: '',
};

function Otp() {
  const [formValue, setFormValue] = useState(initialState);
  const [isResending, setIsResending] = useState(false);
  const { loading, error } = useSelector((state) => ({ ...state.auth }));
  const [token, setToken] = useState('');
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);
  const email = useSelector((state) => state.auth.email);
  console.log(email, "this is the email");
  const { otp } = formValue;
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    console.log(email, "this is the email");
    localStorage.setItem('email', JSON.stringify(email));
  }, [email]);

  useEffect(() => {
    const storedEmail = JSON.parse(localStorage.getItem('email'));
    setFormValue((prevValues) => ({
      ...prevValues,
      email: storedEmail,
    }));
  }, []);

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
        const response = await axios.post('http://localhost:5000/users/otp', { formValue });
        const { otp } = response.data; 
        console.log(response);
        if (response.status === 201) {
          console.log(response.data);
          navigate('/login');
          toast.success("Registered successfully");
        } 
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
      const response = await axios.post('http://localhost:5000/users/resendOTP', { email:email });
      localStorage.setItem('email', JSON.stringify(email));
      dispatch(register({ email: email }));
      console.log(response.data);
      setIsResending(false);
      const { otp } = response.data;
      console.log(otp, "3333333333"); // Retrieve the OTP value from the response
      setFormValue((prevValues) => ({
      ...prevValues,
      otp: otp, // Update the OTP value in the form
    }));
    navigate('/resendOTP');
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
    <div
      style={{
        margin: 'auto',
        padding: '15px',
        maxWidth: '450px',
        alignContent: 'center',
        marginTop: '120px',
      }}
    >
      <MDBCard alignment="center">
        <MDBIcon fas icon="user-circle" className="fa-2x"></MDBIcon>
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
              <MDBBtn style={{ width: '100%' }} className="mt-2" type="submit" onClick={handleSubmit}>
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

export default Otp;
