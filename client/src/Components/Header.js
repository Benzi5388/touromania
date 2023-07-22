import React, { useState, useEffect } from 'react';
import { MDBIcon, MDBNavbar, MDBContainer, MDBNavbarBrand, MDBNavbarToggler, MDBCollapse, MDBNavbarItem, MDBNavbarLink, MDBNavbarNav, MDBInputGroup, MDBInputGroupText, MDBInputGroupElement } from 'mdb-react-ui-kit';
import { useSelector, useDispatch} from 'react-redux';
import { setLogout} from '../Redux/Features/authSlice';
import '../App.css';
import { useNavigate,Link } from 'react-router-dom';
import API from '../Axios/Api'

function Header({ handleSearch }) {
  const [show, setShow] = useState(false)
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate()
  const user = useSelector((state) => (state.auth.user))

  const handleLogout = async () => {
    try {
      await API.post('/users/logout');
      navigate("/login")
      dispatch(setLogout())
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

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
            {user?.login===true && <h5 className="navbar-nav">Welcome: {user?.name}</h5>}
            <MDBNavbarItem>
              <MDBNavbarLink href="/">
                <p className="header-text">Home</p>
              </MDBNavbarLink>
            </MDBNavbarItem>
            {user?.login===true && (
              <>
              <Link to="/addTour">
                <MDBNavbarItem>
                  <MDBNavbarLink>
                    <p className="header-text">Add Tour</p>
                  </MDBNavbarLink>
                </MDBNavbarItem>
                </Link>
                <Link to="/UserDashboard">
                <MDBNavbarItem>
                  <MDBNavbarLink>
                    <p className="header-text">Dashboard</p>
                  </MDBNavbarLink>
                </MDBNavbarItem>
                </Link>
                <Link to="/chat">
                <MDBNavbarItem>
                  <MDBNavbarLink>
                    <p className="header-text">Chat</p>
                  </MDBNavbarLink>
                </MDBNavbarItem>
                </Link>
                <MDBNavbarLink>
                  <MDBNavbarItem>
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
                  </MDBNavbarItem>
                </MDBNavbarLink>
              </>
            )}
            {user?.login ===true? (
              <MDBNavbarItem>
                <MDBNavbarLink className='link' onClick={(e)=>e.preventDefault()}>
                  <p onClick={handleLogout} className="header-text">
                    Logout
                  </p>
                </MDBNavbarLink>
              </MDBNavbarItem>
            ) : (
              <Link to="/login">
              <MDBNavbarItem>
                <MDBNavbarLink>
                  <p className="header-text">Login</p>
                </MDBNavbarLink>
              </MDBNavbarItem>
              </Link>
            )}
          </MDBNavbarNav>

        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );

}
export default Header