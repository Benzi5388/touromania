import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBTypography, MDBSpinner } from 'mdb-react-ui-kit';
import { useDispatch, useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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

  return (
    <>
    <Header/>
    <div className='header-container'>
      <MDBRow className='mt-4'>
        {tours.length === 0 && (
          <MDBCol className='text-center'>
          <div className="no-tour-container">
            <h3 className="no-tour-text text-muted">No Tour Found</h3>
            <img src="/notou.jpg" alt="No Tours Found" className="no-tour-image" />
          </div>
        </MDBCol>
        )}
        <MDBCol  className ="card-contain">
          <MDBContainer >
            <MDBRow className=' row-cols-1 row-cols-md-3 g2 g-4'>
              {tours && tours.map((item, index) => <CardTour key={index} {...item}/>
                )}
            </MDBRow>
          </MDBContainer>
        </MDBCol>
      </MDBRow>
    </div>
    </>
  );
}

export default Home;
