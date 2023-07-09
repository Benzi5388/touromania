import React, {useState, useEffect} from 'react';
import {MDBInputGroup, MDBInputGroupElement, MDBInputGroupText, MDBIcon, MDBNavbar, MDBContainer, MDBNavbarBrand, MDBNavbarToggler, MDBCollapse, MDBNavbarItem, MDBNavbarLink, MDBNavbarNav} from 'mdb-react-ui-kit';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout, setUser } from '../Redux/Features/adminSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'
import axios from 'axios'



function AdminHeader({handleSearch}) {
    const [show, setShow] = useState(false)
    const dispatch = useDispatch();
    const admin = useSelector((state) => state.admin.user);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = async() =>{
      try {
        await axios.get('http://localhost:5000/admin/logout'); // Call the logout route on the server
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
      const admin = JSON.parse(localStorage.getItem('admin'));
      if (!admin) {
        navigate('/adminLogin'); // Navigate to the admin login route
      } else {
        dispatch(setUser(admin)); // Update the admin state in Redux store
      }
    }, [dispatch, navigate]);

    
    return (
      <MDBNavbar fixed="top" expand="lg" className="mdbnavbar">
        <MDBContainer>
          <MDBNavbarBrand className="mdbnavbar-brand" >
            Touromania
          </MDBNavbarBrand>
          <MDBNavbarToggler
            type="button"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setShow(!show)}
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>
          <MDBCollapse show={show} navbar>
            <MDBNavbarNav right fullwidth={false} className="mb-2 mb-lg-0 justify-content-end">
            <MDBNavbarItem>
                <Link to="/AdminDashboard">
                <MDBNavbarLink >
                  <p className="header-text">Dashboard</p>
                </MDBNavbarLink>
                </Link>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink href="/tours">
                  <p className="header-text">Tours</p>
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <Link to="/users">
                <MDBNavbarLink >
                  <p className="header-text">Users</p>
                </MDBNavbarLink>
                </Link>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <Link to = "/adminLogin">
                <MDBNavbarLink>
                  <p onClick={handleLogout} className="header-text">
                    Logout
                  </p>
                </MDBNavbarLink>
                </Link>
              </MDBNavbarItem>
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

export default AdminHeader