import React, { useEffect, useState } from 'react';
import { MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBRow, MDBBtn, MDBIcon, MDBCardGroup, MDBSpinner, MDBCol } from "mdb-react-ui-kit";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setToursByUser, updateTour } from '../Redux/Features/tourSlice';
import axios from 'axios';
import Header from '../Components/Header';
import '../App.css';
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';


function UserDashboard() {
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const { usertours, loading } = useSelector((state) => state.tour);
  console.log(usertours, "tttttttttttt");
  const userId = user?.id;
  console.log(userId, "cccccccccccc");
  const dispatch = useDispatch();

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

  useEffect(() => {
    const fetchUserTours = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tour/userDashboard/${userId}`);
        console.log(response.data, "rrrrrrrrrrrr");
        dispatch(setToursByUser(response.data));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user tours:', error);
      }
    };

    if (userId) {
      fetchUserTours();
    }
  }, [userId, dispatch]);

  if (isLoading || loading) {
    return (
      <>
        <div className='spinner'>
          <MDBSpinner grow size='big' />
        </div>
      </>
    );
  }

  const excerpt = (str) => {
    if (str.length > 45) {
      str = str.substring(0, 45) + "...";
    }
    return str;
  };

  return (
    <>
      <Header />
      <div className='dashboard_container'>
        <h4 className='text-center'>Dashboard : {user?.name}</h4>
        <h6 className='text-center text-muted'>E-mail : {user?.email}</h6>
        <hr style={{ maxWidth: "570px" }} />
        {usertours.length === 0 && (
          <MDBCol className='text-center'>
            <div className="no-tour-container">
              <h3 className="no-tour-text text-muted">You have not added any tour</h3>
              <img src="/notou.jpg" alt="No Tours Found" className="no-tour-image" />
            </div>
          </MDBCol>
        )}
        {usertours && usertours.map((item) => {
          return (
            <MDBCardGroup>
              <MDBCard style={{ maxWidth: "600px" }} key={item._id} className='mt-2'>
                <MDBRow className='g-0'>
                  <MDBCol md='4'>
                    <MDBCardImage
                      className='rounded'
                      src={item.image}
                      alt={item.title}
                      fluid
                    />
                  </MDBCol>
                  <MDBCol md="8">
                    <MDBCardBody>
                      <MDBCardTitle className='text-start'>
                        {item.title}
                      </MDBCardTitle>
                      {item.tags && item.tags.map((tag) => (
                        <span key={tag} className='tag'>#{tag}</span>
                      ))}
                      <MDBCardText className='text-start'>
                        <small className='text-muted'>
                          {excerpt(item.description)}
                        </small>
                      </MDBCardText>
                      <div className="icon_style">
                        <MDBBtn className='mt-1' tag="a" color="none">
                          <MDBIcon
                            fas
                            icon="trash"
                            style={{ color: "#dd4b39" }}
                            size="lg"
                            onClick={() => handleDeleteTour(item._id)}
                          />
                        </MDBBtn>
                        <Link to={`/editTour/${item._id}`}>
                          <MDBIcon
                            fas
                            icon="edit"
                            className='edit_icon'
                            size="lg"
                          />
                        </Link>
                      </div>
                    </MDBCardBody>
                  </MDBCol>
                </MDBRow>
              </MDBCard>
            </MDBCardGroup>
          )
        })}
      </div>
    </>
  )
}

export default UserDashboard