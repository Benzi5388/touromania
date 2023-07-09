import React, { useState, useEffect } from 'react';
import { MDBIcon, MDBNavbar, MDBContainer, MDBNavbarBrand, MDBNavbarToggler, MDBCollapse, MDBNavbarItem, MDBNavbarLink, MDBNavbarNav, MDBInputGroup, MDBInputGroupText, MDBInputGroupElement } from 'mdb-react-ui-kit';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout, saveUserData } from '../Redux/Features/authSlice';
import '../App.css';
import axios from 'axios'

function Header({ handleSearch }) {
  const [show, setShow] = useState(false)
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async() =>{
    try {
      await axios.post('http://localhost:5000/users/logout'); // Call the logout route on the server
      // Perform any additional logout actions (e.g., clear local storage, redirect)
      dispatch(setLogout())
    } catch (error) {
      console.error('Logout error:', error);
    }
    
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission
    handleSearch(searchQuery);
  };

  useEffect(() => {
    // Fetch user data from the Redux store directly
    const userData = localStorage.getItem('userData');
    if (userData) {
      dispatch(saveUserData(JSON.parse(userData)));
    }
  }, [dispatch]);

  const user = useSelector((state) => (state.auth.user))

  return (
    <MDBNavbar className="header-navbar" fixed="top" expand="lg">
      <MDBContainer>
        <MDBNavbarBrand className="header-navbar-brand">
          Touromania
        </MDBNavbarBrand>
        <MDBNavbarToggler
          type="button"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShow(!show)} >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>
        <MDBCollapse show={show} navbar>
          <MDBNavbarNav right fullwidth={false} className="mb-2 mb-lg-0 justify-content-end">
            {user?.id && <h5 className="navbar-nav">Welcome: {user?.name}</h5>}
            <MDBNavbarItem>
              <MDBNavbarLink href="/">
                <p className="header-text">Home</p>
              </MDBNavbarLink>
            </MDBNavbarItem>
            {user?.id && (
              <>
                <MDBNavbarItem>
                  <MDBNavbarLink href="/addTour">
                    <p className="header-text">Add Tour</p>
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href="/UserDashboard">
                    <p className="header-text">Dashboard</p>
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href="/chat">
                    <p className="header-text">Chat</p>
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </>
            )}
            {user?.id ? (
              <MDBNavbarItem>
                <MDBNavbarLink href="/login">
                  <p onClick={handleLogout} className="header-text">
                    Logout
                  </p>
                </MDBNavbarLink>
              </MDBNavbarItem>
            ) : (
              <MDBNavbarItem>
                <MDBNavbarLink href="/login">
                  <p className="header-text">Login</p>
                </MDBNavbarLink>
              </MDBNavbarItem>
            )}
          </MDBNavbarNav>
          <form className='d-flex input-group w-auto'>
            <input
              type='text'
              className='form-control'
              placeholder='Search Tour'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) => e.preventDefault()}
            />
            <MDBInputGroupText>
                <MDBIcon icon="search" onClick={handleSubmit} style={{ cursor: 'pointer' }} />
              </MDBInputGroupText>
          </form>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );

}
export default Header