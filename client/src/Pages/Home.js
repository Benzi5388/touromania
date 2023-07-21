import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';


import { useNavigate } from 'react-router-dom';
import { setTours } from '../Redux/Features/tourSlice';
import CardTour from '../Components/CardTour';
import Header from '../Components/Header';
import axios from 'axios';
import '../App.css';
import Lottie from "lottie-react";
import plane from '../Assets/plane.json'
import API from '../Axios/Api'



function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { tours, loading } = useSelector((state) => state.tour);
  const user = useSelector((state) => (state.auth.user))
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('recent');


  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await API.get(`/tour/?page=${currentPage}&sort=${sortOption}`);
        dispatch(setTours(response.data.tours));
        setTotalPages(response.data.totalPages);
        console.log(response.data.tours);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchTourData();
  }, [currentPage, sortOption, dispatch, user]);



  // useEffect(() => {
  //   if (user?.login===false ) {
  //     navigate('/login'); // Navigate to the home route
  //   }
  // }, [navigate]);

  console.log(user, "home page user");



  if (isLoading || loading) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ width: '200px', height: '200px' }}>
            <Lottie animationData={plane} />
          </div>
        </div>

      </>
    );
  }

  const handleSearch = async (searchQuery) => {
    try {
      const response = await API.get(`/tour/?page=${currentPage}&search=${searchQuery}&sort=${sortOption}`);
      dispatch(setTours(response.data.tours));
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    console.log(option, "option");
  };

  return (
    <>
      <Header handleSearch={handleSearch} />
      <div className='card-style' >
        <MDBRow className='mt-5'>
          {tours.length === 0 ? (
            <MDBCol className='text-center'>
              <div className="no-tour-container flex">
                <h3 className="no-tour-text text-muted">No Tour Found</h3>
                <img src="/notou.jpg" alt="No Tours Found" className="no-tour-image img-fluid align-self-center" />
              </div>
            </MDBCol>
          ) : (
            <>
              <MDBCol >

                <MDBContainer>
                  <div className='sort-dropdown'>
                    <label>Sort:</label>
                    <select
                      className='form-select form-select-sm'
                      value={sortOption}
                      onChange={(e) => handleSortChange(e.target.value)}
                      style={{ fontSize: '14px' }}
                    >
                      <option value='recent' className="option_value">Date</option> {/* Make sure the value is 'recent' */}
                      <option value='likes' className="option_value">Likes</option>
                    </select>
                  </div>
                  {/* <div class="btn-group">
                    <button type="button" class="btn btn-warning dropdown-toggle" data-mdb-toggle="dropdown" aria-expanded="false">
                      Action
                    </button>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Action</a></li>
                      <li><a class="dropdown-item" href="#">Another action</a></li>
                      <li><a class="dropdown-item" href="#">Something else here</a></li>
                      <li><hr class="dropdown-divider" /></li>
                      <li><a class="dropdown-item" href="#">Separated link</a></li>
                    </ul>
                  </div> */}

                  <MDBRow className='row-cols-1 row-cols-md-3 row-cols-lg-4 g-2'>
                    {tours && tours.map((item, index) => <CardTour key={index} {...item} sortOption={sortOption} />)}
                  </MDBRow>
                </MDBContainer>
              </MDBCol>
            </>
          )}
        </MDBRow>
        {tours.length > 0 && (
          <MDBRow className='pagination-row'>
            <MDBCol>
              <MDBContainer>
                <nav style={{ marginBottom: "40px" }} aria-label='...'>
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
        )}
      </div>

    </>
  );


}

export default Home;
