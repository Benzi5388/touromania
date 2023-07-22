import React, {useState, useEffect} from 'react';
import {MDBCard, MDBCardBody, MDBInput, MDBCardFooter,MDBValidation,MDBIcon, MDBSpinner, MDBBtn} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom'; 
import {useDispatch, useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import { saveUserData } from '../Redux/Features/authSlice';
import axios from 'axios';
import Header from '../Components/Header';
import '../App.css';
import loginanimation from "../Assets/loginanimation.json"
import Lotie from 'lottie-react'
import API from '../Axios/Api'


const initialState = {
    email : "",
    password : ""
}
function Login() {
    const [formValue, setFormValue] = useState(initialState)
    const [loading, setLoading] = useState(false); 
    const user = useSelector((state) => state.auth.user);
    console.log(user, "login page");
    const {email, password} = formValue;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (email && password) {
        try {
          const response = await API.post('/users/signin', { formValue });
          if (response.data.token) {
            const { token, userData } = response.data;
            dispatch(saveUserData(userData));
            console.log(userData, "userData");
            navigate('/');
            toast.success("Logged in Successfully");
          } else {
            toast.error("Invalid credentials");
          }
        } catch (error) {
          toast.error("Invalid credentials");
        }
      }
    };
    

      
    const onInputChange = (e)=>{
       let {name, value} = e.target
       setFormValue({...formValue, [name] : value}) 
    }


  useEffect(() => {
    if (user.login) {
      navigate('/'); // Navigate to the home route
    }
  }, [ user]);

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    let redirectUri =
      process.env.REACT_APP_CLIENT_URL + "/users/google/callback";
    let clientId = process.env.REACT_APP_CLIENT_ID;
    
    try {
      window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=email%20profile`,
        "_self"
      );
    } catch (error) {
      console.log("Google login error:", error);
    }
  };
    
  return (
    
    <>
    <Header/>
    <div className='header-container'>
      
        <MDBCard alignment='center'>
        <div className="animation-container">
    <Lotie animationData={loginanimation} className="login-animation" />
  </div>
            {/* <MDBIcon fas icon = "user-circle" className='fa-2x'></MDBIcon> */}
            <h5>Sign In</h5>
            <MDBCardBody>
                <MDBValidation onSubmit={handleSubmit} noValidate className='row g-3'>
                   <div className="col-md-12">
                    <MDBInput label ='email'
                     type = 'email' 
                     value={email} 
                     name='email'
                     onChange={onInputChange} 
                     required 
                     invalid 
                     validation="Please provide your email"
                     />
                   </div>
                   <div className="col-md-12">
                    <MDBInput label ='password'
                     type = 'password' 
                     value={password} 
                     name='password'
                     onChange={onInputChange} 
                     required 
                     invalid 
                     validation="Please provide your password"/>
                   </div>
                   <div className="col-12">
                    <MDBBtn className='mt-2 login-btn'>
                            {loading &&(
                                <MDBSpinner
                                size= 'sm'
                                role = 'status'
                                tag = 'span'
                                className = 'me-2'
                                />
                            )}
                            Login
                    </MDBBtn>
                   </div>
                </MDBValidation>
                <br/>
               <MDBBtn className='mt-2 login-btn btn-danger' onClick={handleGoogleLogin}>Goggle Sign In</MDBBtn>
            </MDBCardBody>
            <MDBCardFooter>
                <Link to="/register">
                <p>Don't have an account? Sign up</p>
                </Link>
                {/* <Link to="/forgotPassword">
                <p>Forgot password?</p>
                </Link> */}
            </MDBCardFooter>
        </MDBCard>
    </div>
    </>
  )
}

export default Login