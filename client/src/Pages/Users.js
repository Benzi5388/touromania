import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; // Import Axios
import { MDBSpinner, MDBRow, MDBContainer,MDBCol, MDBPagination, MDBPaginationItem, MDBPaginationLink,} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../Components/AdminHeader';
import { saveUserData ,updateUser } from '../Redux/Features/authSlice';
import { setUser } from '../Redux/Features/adminSlice';
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';
import '../App.css'
import '../App.css'


function Users() {
  const dispatch = useDispatch();
  const { tours, loading } = useSelector((state) => state.tour);
  const [isLoading, setIsLoading] = useState(true);
  const admin = useSelector((state) => state.admin.user);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

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
          const admin = localStorage.getItem('admintoken');
        const response = await axios.get(`http://localhost:5000/admin/users/?page=${currentPage}&search=${searchQuery}`, {
          headers: {
            'Authorization': `Bearer ${admin}`
          }}); 
        console.log(response.data);
        const user = response.data.users; // Assuming the response contains an array of users
        console.log(user, "userdata");
        dispatch(saveUserData(user)); // Dispatch an action to save the users in Redux store
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [currentPage, dispatch, navigate]);

  if (isLoading || loading) {
    return (
      <>
        <div style={{ margin: "auto", paddingTop: "200px", textAlign: "center" }}>
          <MDBSpinner grow size='big' />
        </div>
      </>
    );
  }

  const handleSearch = async (searchQuery) => {
    try {
      const response = await axios.get(`http://localhost:5000/admin/users/?page=${currentPage}&search=${searchQuery}`)
      dispatch(saveUserData(response.data.users));
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = (item_id) => {
    Swal.fire({
      title: 'Are you sure you want to remove this user?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.get(`http://localhost:5000/admin/user/${item_id}`);
          dispatch(updateUser(item_id)); // Remove the deleted user from Redux store

          Swal.fire(
            'Deleted!',
            'User deleted successfully.',
            'success'
          );
        } catch (error) {
          console.error(error);
          toast.error("something went wrong")
        }
      }
    });
  };

  return (
    <>
      <AdminHeader handleSearch= {handleSearch}/>
      <div className='mt-5'>
        <table className="table align-middle ps-5 pe-5  bg-white tour-table">
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
                <button
                      onClick={() => handleDeleteUser(item._id)}
                      className='btn btn-danger' >
                      Remove
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label='...'>
      <MDBRow className='pagination-row'>
            <MDBCol>
              <MDBContainer>
                <nav aria-label='...'>
                  <MDBPagination circle className='mb-0'>
                    <MDBPaginationItem disabled={currentPage === 1}>
                      <MDBPaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
                        Previous
                      </MDBPaginationLink>
                    </MDBPaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <MDBPaginationItem active={currentPage === page} key={page}>
                        <MDBPaginationLink onClick={() => setCurrentPage(page)}>
                          {page}
                        </MDBPaginationLink>
                      </MDBPaginationItem>
                    ))}
                    <MDBPaginationItem disabled={currentPage === totalPages}>
                      <MDBPaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
                        Next
                      </MDBPaginationLink>
                    </MDBPaginationItem>
                  </MDBPagination>

                </nav>
              </MDBContainer>
            </MDBCol>
          </MDBRow>
    </nav>
    </>
  );
}

export default Users;
