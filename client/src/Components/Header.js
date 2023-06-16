import React, {useState} from 'react';
import {MDBCard, MDBCardBody, MDBInput, MDBCardFooter,MDBValidation,MDBIcon, MDBSpinner, MDBBtn, MDBNavbar, MDBContainer, MDBNavbarBrand, MDBNavbarToggler, MDBCollapse, MDBNavbarItem, MDBNavbarLink, MDBNavbarNav} from 'mdb-react-ui-kit';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../Redux/Features/authSlice';


function Header() {
    const [show, setShow] = useState(false)
    const dispatch = useDispatch();
    
    const handleLogout = () =>{
      dispatch(setLogout())
    }
    const {user} = useSelector((state) => ({...state.auth}))
  return (
    <MDBNavbar fixed="top" expand ="lg" style = {{backgroundColor : '#f0e6ea'}}>
      <MDBContainer>
        <MDBNavbarBrand href = '/' style = {{color: '#606080', fontWeight :'600', fontSize:'22px'}}>
            Touropedia
        </MDBNavbarBrand>
        <MDBNavbarToggler
        type="button"
        aria-expanded = "false"
        aria-label ="Toggle navigation"
        onClick = {() => setShow(!show)}
        >
          <MDBIcon icon ="bars" fas/>
        </MDBNavbarToggler>
        <MDBCollapse show={show} navbar>
           <MDBNavbarNav right fullwidth={false} className='mb-2 mb-lg-0 justify-content-end'>
            {user?.result?._id && (
              <h5 style ={{marginRight:'30px', marginTop:'17px'}}>Logged in as : {user?.result?.name} </h5>
            )}
             <MDBNavbarItem>
              <MDBNavbarLink href='/'>
                 <p className='header-text'>Home</p>
              </MDBNavbarLink>
             </MDBNavbarItem>
             {user?.result?._id && (
              <>
              <MDBNavbarItem>
              <MDBNavbarLink href='/addTour'>
                 <p className='header-text'>Add Tour</p>
              </MDBNavbarLink>
             </MDBNavbarItem>
             <MDBNavbarItem>
              <MDBNavbarLink href='/dashboard'>
                 <p className='header-text'>Dashboard</p>
              </MDBNavbarLink>
             </MDBNavbarItem>
              </>
             )}
             {user?.result?._id? (
             
                <MDBNavbarItem>
                 <MDBNavbarLink href='/login'>
                 <p onClick= {handleLogout} className='header-text'>Logout</p>
                 </MDBNavbarLink>
                 </MDBNavbarItem>) :
              (
              <MDBNavbarItem>
              <MDBNavbarLink href='/login'>
                 <p className='header-text'>Login</p>
              </MDBNavbarLink>
             </MDBNavbarItem>
             )}
             
             
           </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  )
}

export default Header