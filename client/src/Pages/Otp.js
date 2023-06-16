import React, {useState, useEffect} from 'react';
import {MDBCard, MDBCardBody, MDBInput, MDBCardFooter,MDBValidation,MDBIcon, MDBSpinner, MDBBtn} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom'; 
import {useDispatch, useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import { verify } from '../Redux/Features/authSlice';



const initialState = {
    otp : ''
}
function Otp() {
    const [formValue, setFormValue] = useState(initialState)
    const {loading, error} = useSelector((state) =>({...state.auth}))
    const [token,setToken]=useState('')
    const {otp} = formValue;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
       error && toast.error(error)
       const response = localStorage.getItem('profile')
       var {token} = JSON.parse(response)
      
       setToken(token)
    }, [error]);
    const handleSubmit = (e) =>{
       e.preventDefault()
       if(otp){
        dispatch(verify({formValue, navigate, toast,token}))
       }
    }
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormValue({...formValue, [name]: value,
        });
      };
      

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
            <h5>OTP</h5>
            <MDBCardBody>
                <MDBValidation onSubmit={handleSubmit} noValidate className='row g-3'>
                   <div className="col-md-12">
                    <p>Please check your email and enter the otp below!!</p>
                    <MDBInput label ='OTP'
                     type = 'text' 
                     value={formValue.otp} 
                     name='otp'
                     onChange={onInputChange} 
                     required 
                     invalid 
                     validation="Enter the otp"/>
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
  )
}

export default Otp;