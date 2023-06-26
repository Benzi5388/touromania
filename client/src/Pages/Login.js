import React, {useState, useEffect} from 'react';
import {MDBCard, MDBCardBody, MDBInput, MDBCardFooter,MDBValidation,MDBIcon, MDBSpinner, MDBBtn} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom'; 
import {useDispatch, useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import { googleSignIn, saveUserData } from '../Redux/Features/authSlice';
import {GoogleLogin} from 'react-google-login'
import axios from 'axios';
import Header from '../Components/Header';



const initialState = {
    email : "",
    password : ""
}
function Login() {
    const [formValue, setFormValue] = useState(initialState)
    const [loading, setLoading] = useState(false); 
    // const {loading, error} = useSelector((state) =>({...state.auth}))
    const user = useSelector((state) => state.auth.user);
    console.log(user, "userdata");
    const {email, password} = formValue;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // useEffect(()=>{
    //    error && toast.error(error)
    // }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email && password) {
          const response = await axios.post('http://localhost:5000/users/signin', { formValue }).catch((err) => console.log(err));
          if (response.data.token) {
            const { token, userData } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(userData));
            dispatch(saveUserData(userData));
            navigate('/');
            toast.success("Logged in Successfully")
          } else {
            toast.error(response.data.message);
          }
        }
      };
      

    const onInputChange = (e)=>{
       let {name, value} = e.target
       setFormValue({...formValue, [name] : value}) 
    }

    const googleSuccess = (res) =>{
    //    const email = res?.profileObj?.email;
    //    const name = res?.profileObj?.name;
    //    const token = res?.tokenId;
    //    const googleId = res?.googleId;
    //    const result = {email, name, token, googleId}
    //    dispatch(googleSignIn({result, navigate, toast}))
    };
    const googleFailure = (err) =>{
        // toast.error(err)
    };
  return (
    <>
    <Header/>
    <div style={{
        margin : "auto", 
        padding : '15px',
        maxWidth : '450px', 
        alignContent :"center",
        marginTop :'120px'  }}
        >
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
                    <MDBBtn style={{
                        width : "100%"}} className='mt-2'>
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
                    <MDBBtn style = {{width:'100%'}} 
                    color = "danger" 
                    onClick = {renderProps.onClick}
                    disabled = {renderProps.disabled}
                >
                      <MDBIcon className='me-2' fab icon= "google"/>Google Sign In
                    </MDBBtn>
                 )}
                 onSuccess={googleSuccess}
                 onFailure={googleFailure}
                 cookiePolicy='single_host_origin'
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