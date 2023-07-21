import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTour, updateTour, setTours } from '../Redux/Features/tourSlice';
import { MDBCol, MDBPaginationItem, MDBRow, MDBSpinner, MDBPaginationLink, MDBPagination, MDBContainer } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import AdminHeader from '../Components/AdminHeader';
import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';
import '../App.css';
import API from '../Axios/Api'




function Tours() {
  const dispatch = useDispatch();
  const { tours, loading } = useSelector((state) => state.tour);
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const admin = useSelector((state) => state.admin.user);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // useEffect(() => {
  //   const admin = JSON.parse(localStorage.getItem('admin'));
  //   if (!admin) {
  //     navigate('/adminLogin'); // Navigate to the admin login route
  //   } else {
  //     dispatch(setUser(admin)); // Update the admin state in Redux store
  //   }
  // }, [dispatch, navigate]);

  const handleSearch = async (searchQuery) => {
    try {
      const response = await API.get(`/admin/tours/?page=${currentPage}&search=${searchQuery}`)
      dispatch(setTours(response.data.tours));
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  useEffect(() => {
    console.log(startDate, "startDate")
  }, [startDate])
  useEffect(() => {
    console.log(endDate, "endDate")
  }, [endDate])

  const handleEndDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
    console.log(startDate, "startdate");
    if (selectedDate > currentDate || selectedDate < startDate) {
      // Set the end date to the current date
      setEndDate(currentDate.toISOString().split('T')[0]);
    } else {
      setEndDate(event.target.value);
    }
  };

  const handleDateSearch = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        startDate: startDate,
        endDate: endDate,
      });
      const response = await axios.get(`http://localhost:5000/admin/tours/?${queryParams.toString()}`);
      dispatch(setTours(response.data.tours));
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        console.log(API, "toooooooooooooo");
        const response = await axios.get(`http://localhost:5000/admin/tours/?page=${currentPage}`);
        dispatch(setTours(response.data.tours));
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchTourData();
  }, [currentPage, dispatch]);

  if (isLoading || loading) {
    return (
      <>
        <div className="spinner">
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
          await axios.get(`http://localhost:5000/admin/tours/${tourId}`);
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
      <AdminHeader handleSearch={handleSearch} />
      <div className='mt-5'>
        {tours.length === 0 ? (
          <MDBCol className='text-center'>
            <div className="no-tour-container">
              <h3 className="no-tour-text text-muted">No Tour Found</h3>
              <img src="/notou.jpg" alt="No Tours Found" className="no-tour-image" />
            </div>
          </MDBCol>
        ) : (
          <>
            <MDBContainer>
              <div className="date-picker-wrapper">
                <div className="date-picker-container">
                  <label className='date_label' htmlFor="startDate">From: </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="form-control smaller-input"
                    placeholder="From"
                  />
                </div>
                <div className="date-picker-container">
                  <label htmlFor="endDate" className='date_label'>To:</label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="form-control smaller-input"
                    placeholder="To"
                  />
                  <button onClick={handleDateSearch} className="btn btn-primary">Search</button>
                </div>
              </div>
            </MDBContainer>
            <table className="table align-middle ps-5 pe-5  bg-white tour-table">
              <thead className="bg-light">
                <tr>
                  <th>Creator</th>
                  <th>Creator-Id</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Description</th>
                  <th>Created-At</th>
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
                      <p className="fw-bold mb-1">{item.creator}</p>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">{item.title}</p>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">{item.location}</p>
                    </td>
                    <td>
                      <p className="text-muted mb-0">{excerpt(item.description)}
                        <Link to={`/admin/${item._id}`}>Read More</Link>
                      </p>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">{new Date(item.createdAt).toLocaleDateString()}</p>
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
          </>
        )}
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

export default Tours;
