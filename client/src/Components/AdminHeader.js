import React, {useState, useEffect} from 'react';
import { MDBInputGroupText, MDBIcon, MDBNavbar, MDBContainer, MDBNavbarBrand, MDBNavbarToggler, MDBCollapse, MDBNavbarItem, MDBNavbarLink, MDBNavbarNav} from 'mdb-react-ui-kit';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout, setUser } from '../Redux/Features/adminSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'
import axios from 'axios'
import API from '../Axios/Api'
import { toast } from 'react-toastify';


function AdminHeader({handleSearch}) {
    const [show, setShow] = useState(false)
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const admin= useSelector((state)=>state.admin.user)

    const handleLogout = async() =>{
      try {
        await API.get('/admin/logout'); // Call the logout route on the server
        dispatch(setLogout())
      } catch (error) {
        toast.error('Something went wrong');
      }
    }

    const handleSubmit = (e) => {
      e.preventDefault(); // Prevents the default form submission
      handleSearch(searchQuery);
    };

    useEffect(() => {
      if (admin?.user?.login===false) {
        navigate('/adminLogin'); // Navigate to the admin login route
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
                <Link to="/tours">
                <MDBNavbarLink>
                  <p className="header-text">Tours</p>
                </MDBNavbarLink>
                </Link>
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