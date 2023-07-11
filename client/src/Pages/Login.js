import React, {useState, useEffect} from 'react';
import {MDBCard, MDBCardBody, MDBInput, MDBCardFooter,MDBValidation,MDBIcon, MDBSpinner, MDBBtn} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom'; 
import {useDispatch, useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import { saveGoogleData, saveUserData } from '../Redux/Features/authSlice';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import Header from '../Components/Header';
import { GoogleOAuthProvider } from '@react-oauth/google';
import '../App.css'



const initialState = {
    email : "",
    password : ""
}
function Login() {
    const [formValue, setFormValue] = useState(initialState)
    const [loading, setLoading] = useState(false); 
    const user = useSelector((state) => state.auth.user);
    console.log(user, "userdata");
    const {email, password} = formValue;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (email && password) {
        try {
          const response = await axios.post('http://localhost:5000/users/signin', { formValue });
          if (response.data.token) {
            const { token, userData } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(userData));
            dispatch(saveUserData(userData));
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

    const googleSuccess = (res) =>{
       const email = res?.profileObj?.email;
       console.log(email, 66666666666);
       const name = res?.profileObj?.name;
       const token = res?.tokenId;
       const googleId = res?.googleId;
       const result = {email, name, token, googleId}
       dispatch(saveGoogleData(result))
    };
    const googleFailure = (err) =>{
        toast.error(err)
    };

    //ClientID : "993933691849-nhp1osa0gk1kikh4ovgf3vjd8p9j8r0q.apps.googleusercontent.com"
    //clientsecret : "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"
    //api_key : "AIzaSyD5w8YgG9igWBymotjFuALOVq5ALcE3ghQ"

  //   const handleGoogleLogin = async (e) => {
  //     e.preventDefault()
  //     let redirectUri = process.env.REACT_APP_SERVER_URL+"/user/auth/google/callback"
  //     let clientId = "572510792166-vpf7ki1vmt5t7u4er1afdsgn7oe1l1l9.apps.googleusercontent.com"
  //     try {
  //         window.open(
  //             `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=email%20profile`,
  //             "_self"
  //         )
  //     } catch (error) {
  //         console.log('Google login error:', error);
  //     }
  // };

  useEffect(() => {
    if (user) {
      navigate('/'); // Navigate to the home route
    }
  }, [user, navigate]);
    
  return (
    
    <>
    <Header/>
    {/* <div>
    <GoogleOAuthProvider clientId="993933691849-jd94dp1eg3fv45gj3nvi8u8a6mq2ms96.apps.googleusercontent.com">
  <GoogleLogin
    onSuccess={credentialResponse => {
      console.log(credentialResponse);
    }}
    onError={() => {
      console.log('Login Failed');
    }}
  />
</GoogleOAuthProvider>
   </div> */}
    <div className='header-container'>
        <MDBCard alignment='center'>
            <MDBIcon fas icon = "user-circle" className='fa-2x'></MDBIcon>
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
                <GoogleLogin
                 clientId='993933691849-jd94dp1eg3fv45gj3nvi8u8a6mq2ms96.apps.googleusercontent.com'
                 render={(renderProps) => (
                    <MDBBtn className="login-btn"
                    color = "danger" 
                    onClick = {renderProps.onClick}
                    disabled = {renderProps.disabled}>
                      <MDBIcon className='me-2' fab icon= "google"/>Google Sign In
                    </MDBBtn>
                 )}
                 onSuccess={googleSuccess}
                 onFailure={googleFailure}
                />
            </MDBCardBody>
            <MDBCardFooter>
                <Link to="/register">
                <p>Don't have an account? Sign up</p>
                </Link>
                <Link to="/forgotPassword">
                <p>Forgot password?</p>
                </Link>
            </MDBCardFooter>
        </MDBCard>
    </div>
    </>
  )
}

export default Login