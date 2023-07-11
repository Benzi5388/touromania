import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBSpinner, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTours } from '../Redux/Features/tourSlice';
import CardTour from '../Components/CardTour';
import Header from '../Components/Header'
import axios from 'axios';
import '../App.css';


function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tours, loading } = useSelector((state) => state.tour);
  const user = useSelector((state) => (state.auth.user))
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('recent');

console.log(user, "home page user");
  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tour/?page=${currentPage}&sort=${sortOption}`);
        dispatch(setTours(response.data.tours));
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchTourData();
  }, [currentPage, sortOption, dispatch]);

  useEffect(() => {
    if (user) {
      navigate('/'); // Navigate to the home route
    }
  }, [user, navigate]);

  if (isLoading || loading) {
    return (
      <>
        <div className='spinner'>
          <MDBSpinner grow size='big' />
        </div>
      </>
    );
  }

  const handleSearch = async (searchQuery) => {
    try {
      const response = await axios.get(`http://localhost:5000/tour/?page=${currentPage}&search=${searchQuery}&sort=${sortOption}`);
      dispatch(setTours(response.data.tours));
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
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
                    <option value='recent' className="option_value">Date</option>
                    <option value='likes' className="option_value">Likes</option>
                  </select>
                </div>
                <MDBRow className='row-cols-1 row-cols-md-3 g-2'>
                  {tours && tours.map((item, index) => <CardTour key={index} {...item} handleSortChange={handleSortChange} />)}
                </MDBRow>
              </MDBContainer>
            </MDBCol>)}
        </MDBRow>
        {tours.length > 0 && (
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
        )}
      </div>

    </>
  );


}

export default Home;
