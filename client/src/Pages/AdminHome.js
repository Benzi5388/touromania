import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTour, updateTour, setTours } from '../Redux/Features/tourSlice';
import { MDBTable, MDBTableBody, MDBTableHead, MDBSpinner, MDBSwitch } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import AdminHeader from '../Components/AdminHeader';
import { setUser } from '../Redux/Features/adminSlice';
import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';
import '../App.css'


function AdminHome() {
  const dispatch = useDispatch();
  const { tours, loading } = useSelector((state) => state.tour);
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const admin = useSelector((state) => state.admin.user);
  const navigate = useNavigate();


  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin) {
      navigate('/adminLogin'); // Navigate to the admin login route
    } else {
      dispatch(setUser(admin)); // Update the admin state in Redux store
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tour/');
        dispatch(setTours(response.data));
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchTourData();
  }, [dispatch]);


  if (isLoading || loading) {
    return (
      <>
        <div className = "spinner">
          <MDBSpinner grow size='big' />
        </div>
      </>
    );
  }


  const handleDeleteTour = (tourId) => {
    Swal.fire({
      title: 'Are you sure you want to delete this tour?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.get(`http://localhost:5000/tour/${tourId}`);
          dispatch(updateTour(tourId)); // Remove the deleted tour from Redux store

          Swal.fire(
            'Deleted!',
            'Tour deleted successfully.',
            'success'
          );
        } catch (error) {
          console.error(error);
          toast.error("something went wrong")
        }
      }
    });
  };


  const excerpt = (str) => {
    if (str.length > 60) {
      str = str.substring(0, 45) + "...";
    }
    return str;
  };

  const imageUrl = `http://localhost:5000/uploads/`;
  return (
    <>
      <AdminHeader />
      <div className='mt-5'>
        {tours.length === 0 ? (
          <h3>No data available</h3>
        ) : (
          <table className="table align-middle ps-5 pe-5  bg-white tour-table">
            <thead className="bg-light">
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Description</th>
                <th>Image</th>
                <th>Listing</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((item, index) => (
                <tr key={index} {...item}>
                  <td>
                    <p className="fw-bold mb-1">{item.name}</p>
                  </td>
                  <td>
                    <p className="fw-normal mb-1">{item.title}</p>
                  </td>
                  <td>
                    <p className="text-muted mb-0">{excerpt(item.description)}
                      <Link to={`/adminhome/${item._id}`}>Read More</Link>
                    </p>
                  </td>
                  <div>
                    <img
                      src={item.image}
                      alt=""
                      className="rounded-circle tour-image"
                    />
                  </div>
                  <td>
                    <button
                      onClick={() => handleDeleteTour(item._id)}
                      className='btn btn-danger' >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>

  );
}

export default AdminHome;
