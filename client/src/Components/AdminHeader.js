import React, {useState, useEffect} from 'react';
import {MDBInputGroup, MDBInputGroupElement, MDBInputGroupText, MDBIcon, MDBNavbar, MDBContainer, MDBNavbarBrand, MDBNavbarToggler, MDBCollapse, MDBNavbarItem, MDBNavbarLink, MDBNavbarNav} from 'mdb-react-ui-kit';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout, setUser } from '../Redux/Features/adminSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'



function AdminHeader({handleSearch}) {
    const [show, setShow] = useState(false)
    const dispatch = useDispatch();
    const admin = useSelector((state) => state.admin.user);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () =>{
      dispatch(setLogout())
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
            Touropedia
            <form style={{ marginLeft: "10px" }}>
            <MDBInputGroup>
              <MDBInputGroupElement
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={(e) => e.preventDefault()}
              />
              <MDBInputGroupText>
                <MDBIcon icon="search" onClick={handleSubmit} style={{ cursor: 'pointer' }} />
              </MDBInputGroupText>
            </MDBInputGroup>
          </form>
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
                <MDBNavbarLink href="/adminhome">
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
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    );
}

export default AdminHeader