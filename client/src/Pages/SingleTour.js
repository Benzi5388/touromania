import React, { useEffect, useState } from 'react';
import { MDBCard, MDBCardBody, MDBCardText, MDBCardImage, MDBContainer, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import moment from 'moment';
import axios from 'axios';
import { setTour } from '../Redux/Features/tourSlice';
import Header from '../Components/Header';
import '../App.css';

function SingleTour() {
  const dispatch = useDispatch()
  const { selectedTour, loading } = useSelector((state) => state.tour);

  console.log(selectedTour, "hhhhhhhhhh")
  const { id } = useParams();
  console.log(id, "444444444444");
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        console.log(response.data, "res.data");
        dispatch(setTour(response.data));
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchTourData();
  }, [dispatch, id]);

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
      <Header />
      <MDBContainer>
        <MDBCard className='mb-3 mt-5'>
          <MDBCardImage
            position='top'
            style={{ width: "100%", maxHeight: "600px" }}
            src={selectedTour?.image}
            alt={selectedTour?.title}
          />
          <MDBCardBody>
            <h3>{selectedTour?.title}</h3>
            <span>
              <p className='text-start tourName'>Created By : {selectedTour?.name}</p>
            </span>
            <div style={{ float: "left" }}>
              <span className='text-start'>
                {selectedTour?.tags.map((item) => `#${item}`)}
              </span>
            </div>
            <br />
            <MDBCardText className='text-start mt-2'>
              <span className="calendar-icon">
                <FaCalendarAlt />
              </span>
              <small className='text-muted'>
                {moment(selectedTour?.createdAt).fromNow()}
              </small>
            </MDBCardText>
            <MDBCardText className='lead mb-0 text-start'>{selectedTour?.description}
            </MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  )
}

export default SingleTour