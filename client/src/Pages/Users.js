import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; // Import Axios
import { MDBTable, MDBTableBody, MDBTableHead, MDBSpinner, MDBSwitch } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import AdminHeader from '../Components/AdminHeader';
import { saveUserData} from '../Redux/Features/authSlice';
import { setUser } from '../Redux/Features/adminSlice';

function Users() {
  const dispatch = useDispatch();
  const { tours, loading } = useSelector((state) => state.tour);
  const [isLoading, setIsLoading] = useState(true);
  const admin = useSelector((state) => state.admin.user);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin) {
      navigate('/adminLogin'); // Navigate to the admin login route
    } else {
      dispatch(setUser(admin)); // Update the admin state in Redux store
    }

    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/users'); // Replace with your actual API endpoint
        const user = response.data; // Assuming the response contains an array of users
           console.log(user, "userdata");
        dispatch(saveUserData(user)); // Dispatch an action to save the users in Redux store
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [dispatch, navigate]);

  if (isLoading || loading) {
    return (
      <>
        <div style={{ margin: "auto", paddingTop: "200px", textAlign: "center" }}>
          <MDBSpinner grow size='big' />
        </div>
      </>
    );
  }

  const handleToggleStatus = () => {};

  return (
    <>
  
  <AdminHeader />
   
    <div className='mt-5'>
    
      <table className="table align-middle ps-5 pe-5  bg-white" style={{ fontSize: "20px" }}>
      <thead className="bg-light">
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Listing</th>
        </tr>
      </thead>
        <tbody>
          {user.map((item, index) => (
            <tr key={index} {...item}>
              <td>
                <p className="fw-bold mb-1">{item._id}</p>
              </td>
              <td>
                <p className="fw-normal mb-1">{item.name}</p>
              </td>
              <td>
                <p className="fw-normal mb-1">{item.email}</p>
              </td>
              <td>
                <MDBSwitch
                  checked={item.listed}
                  onChange={() => handleToggleStatus(item._id)}
                  className={item.listed ? 'text-success' : 'text-secondary'}
                  label={item.listed ? 'Listed' : 'Unlisted'}
                  id={`toggleSwitch-${item._id}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}

export default Users;
