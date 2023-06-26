import React, {useState, useEffect} from 'react';
import {MDBCard, MDBCardBody, MDBInput, MDBCardFooter,MDBValidation,MDBIcon, MDBSpinner, MDBBtn} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom'; 
import {useDispatch, useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import { setUser } from '../Redux/Features/adminSlice';

const initialState = {
    email : "",
    password : ""
}
function Login() {
    const [formValue, setFormValue] = useState(initialState)
    const {loading, error} = useSelector((state) =>({...state.auth}))
    const {email, password} = formValue;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
       error && toast.error(error)
    }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
          // Simulate async login request
          setTimeout(() => {
            const user = { email }; // Replace with actual user data
    
            dispatch(setUser(user));
            toast.success('Logged in successfully!');
            navigate('/adminhome');
          }, 2000);
        }
      };
    const onInputChange = (e)=>{
       let {name, value} = e.target
       setFormValue({...formValue, [name] : value}) 
    }

  return (
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