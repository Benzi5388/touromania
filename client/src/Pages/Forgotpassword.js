import React, {useState, useEffect} from 'react';
import {MDBCard, MDBCardBody, MDBInput, MDBCardFooter,MDBValidation,MDBIcon, MDBSpinner, MDBBtn} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom'; 
import {useDispatch, useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios'
import Cookies from 'js-cookie';
import Header from '../Components/Header';
import '../App.css'
import loginanimation from "../Assets/loginanimation.json"
import Lotie from 'lottie-react'
import API from '../Axios/Api'


const initialState = {
    email : "",
    password : ""
}
function ForgotPassword() {
    const [formValue, setFormValue] = useState(initialState)
    const {loading, error} = useSelector((state) =>({...state.auth}))
    const {email} = formValue;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
       error && toast.error(error)
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email) {
          try {
            const response = await API.post('/users/forgotPassword', { email :email});
            console.log(response.data); // Log the response from the server
            Cookies.set('email', email, { expires: 1 });
            navigate('/verifyOTP')
            toast.success("Otp sent successfully")
          } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
          }
        }
      };

    const onInputChange = (e)=>{
       let {name, value} = e.target
       setFormValue({...formValue, [name] : value}) 
    }

  return (
    <>
    <Header/>
    <div className='header-container'  >
      <div style={{marginBottom:"25px", marginTop:"25px"}}>
        <MDBCard alignment='center'>
        <div className="animation-container">
    <Lotie animationData={loginanimation} className="login-animation" />
  </div>
            <h5>Please enter your email</h5>
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
                     validation="enter your email"/>
                   </div>
                   <div className="col-12">
                    <MDBBtn className='mt-2 login-btn'>
                            {loading && (
                                <MDBSpinner
                                size= 'sm'
                                role = 'status'
                                tag = 'span'
                                className = 'me-2'
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
    </div>
    </>
  )
}

export default ForgotPassword;