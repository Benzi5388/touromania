import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBTypography, MDBSpinner } from 'mdb-react-ui-kit';
import { useDispatch, useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setTours } from '../Redux/Features/tourSlice';
import CardTour from '../Components/CardTour';
import Header from '../Components/Header'
import axios from 'axios';


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
        <div style={{ margin: "auto", paddingTop: "200px", textAlign: "center" }}>
          <MDBSpinner grow size='big' />
        </div>
      </>
    );
  }

  return (
    <>
    <Header/>
    <div style={{
      margin:"auto",
      padding:"15px",
      maxWidth :"1000px",
      alignContent:"center"
    }}>
      <MDBRow className='mt-5'>
        {tours.length === 0 && (
          <MDBTypography className='text-center mb-0' tag="h2">
            No Tours Found
          </MDBTypography>
        )}
        <MDBCol>
          <MDBContainer>
            <MDBRow className='row-cols-1 row-cols-md-3 g2 g-2'>
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
