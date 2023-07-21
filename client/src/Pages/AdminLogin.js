import React, {useState, useEffect} from 'react';
import {MDBCard, MDBCardBody, MDBInput, MDBValidation,MDBIcon, MDBSpinner, MDBBtn} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom'; 
import {useDispatch, useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import { setUser } from '../Redux/Features/adminSlice';
import '../App.css'
import axios from 'axios'
import API from '../Axios/Api'

const initialState = {
    email : "",
    password : ""
}
function Login() {
    const [formValue, setFormValue] = useState(initialState)
    const {loading, error} = useSelector((state) =>({...state.auth}))
    const {email, password} = formValue;
    const user = useSelector((state) => (state.admin.user))
    console.log(user, "user");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
       error && toast.error(error)
    }, [error]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
          // Make HTTP request to authenticate the user and receive the cookie
          API
            .post('/admin/adminLogin', { email, password }, { withCredentials: true })
            .then((response) => {
              console.log(response, "response");
              const user =  {email} ;
              dispatch(setUser(user));
              toast.success('Logged in successfully!');
              navigate('/AdminDashboard');
            })
            .catch((error) => {
              console.error(error);
              toast.error('Something went wrong');
            });
        }
      };

    const onInputChange = (e)=>{
       let {name, value} = e.target
       setFormValue({...formValue, [name] : value}) 
    }

  return (
    <div className ="header-container" >
        <MDBCard alignment='center'  style={{marginTop:"115px", marginBottom:"120px"}}>
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
                            {loading && (
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
            </MDBCardBody>
        </MDBCard>
    </div>
  )
}

export default Login