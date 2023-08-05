import React, { useState, useEffect } from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBCardGroup, MDBBtn, MDBIcon, MDBTooltip } from 'mdb-react-ui-kit'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../App.css'
import axios from 'axios';
import { setNewTourState, setLikedTourIds, setRefresh } from '../Redux/Features/tourSlice';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import useRazorpay from "react-razorpay";
import API from '../Axios/Api'
import { toast } from 'react-toastify';



function CardTour({ title, location, description, tags, _id, name, image, createdAt, likes, privacy, email}) {
  const [Razorpay] = useRazorpay();
  const [liked, setLiked] = useState(false);
  const likedTourIds = useSelector(state => state.tour.likedTourIds);
  const user = useSelector(state => state.auth.user);
  const id = user._id;
  const userName = name;
  const emailId = email
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const excerpt = (str) => {
    if (str.length > 45) {
      str = str.substring(0, 45) + "...";
    }
    return str;
  };

  const Likes = () => {
    if (!user) {
      return (
        <Link to="/login">
          <MDBIcon far icon="thumbs-up" />
          &nbsp;Likes{likes.length}
        </Link>
      );
    }
    if (likes.length >= 0) {
      const likeCount = likes.length;
      const includesUser = likes.includes(user.id);
      const liked = includesUser;
      if (liked) {
        return (
          <>
            <MDBIcon fas icon='thumbs-up' />
            &nbsp;
            {likeCount}Likes
          </>
        );
      } else {
        return (
          <>
            <MDBIcon far icon='thumbs-up' />
            &nbsp;{likeCount} Likes
          </>
        );
      }
    }

    return (
      <>
        <MDBIcon icon={liked ? 'thumbs-up' : ['far', 'thumbs-up']} />
        &nbsp;{likes.length} Like{likes.length !== 1 ? 's' : ''}
      </>
    );
  };

  const handlelike = async () => {
    try {
      if (user?.login === false) {
        navigate('/login');
        return;
      }
      const response = await API.patch(`/tour/like/${_id}`);
      const updatedTour = response.data;
      const newLikedState = !liked;
      setLiked(newLikedState);
      dispatch(setNewTourState({ tourId: _id, updatedTour }));
      const updatedLikedTourIds = newLikedState
        ? [...likedTourIds, _id]
        : likedTourIds.filter((tourId) => tourId !== _id);
      dispatch(setLikedTourIds(updatedLikedTourIds));
      localStorage.setItem(`liked_${_id}`, JSON.stringify(newLikedState));
    } catch (error) {
      console.error('Error liking tour:', error);
    }
  };

  const handlePayment = async (params) => {
    try {
      
      const response = await API.post(`/users/payment/${id}`, { params });
      const order = response.data.orderId;
      const options = {
        key: "rzp_test_Cvuio2xnzehdPu",
        amount: "49900",
        currency: "INR",
        name: "Acme Corp",
        description: "Test Transaction",
        image: "../../public/favicon.ico",
        order_id: order,
        handler: function (response) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Payment Successful',
            showConfirmButton: false,
            timer: 1500,
          });
          API.post('/users/paymentSuccess', { isPremium: true, id })
            .then(() => {
              dispatch(setRefresh({}))
              toast.success("Congratulations!! You are now a premium member")
            })
            .catch((error) => {
              console.log(error)
              toast.error("Something went rong.")
            });
        },
        prefill: {
          name: { userName },
          email: { emailId },
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error handling payment:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="">Why do I have this issue?</a>',
      });
    }
  };

  const imageUrl = `http://localhost:5000/uploads/${image}`;
  return (
    <MDBCardGroup>
      <MDBCard className='h-100 mt-3 d-sm-flex mdb-card'>
        <MDBCardImage
          className='card-image'
          src={image}
          alt={title}
          position='top'
        />
        <div className='top-left'>{name}</div>
        <div className='top-right'>{privacy === 'private' && (
          <div className='top-right'>
            <i className='fas fa-crown'></i>
          </div>
        )}</div>
        <span className='text-start tag-card'>
          <div>
            <span className='location bold-text'>
              <i className='fas fa-map-marker-alt'></i>
              &nbsp;{/* Add a non-breaking space */}
              {location}
              <MDBBtn style={{ float: "right" }} tag="a" color='none' onClick={handlelike}>
                <Likes />
              </MDBBtn>
            </span>
          </div>
          <div>
            {tags.map((item) => `#${item}`)}
          </div>
          <div>
            <span className='created-at'>
              <i className='far fa-calendar-alt'></i>
              &nbsp;{/* Add a non-breaking space */}
              {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </span>
        <MDBCardBody>
          <MDBCardTitle className='text-start'>{title}</MDBCardTitle>
          <MDBCardText className='text-start'>
            {excerpt(description)}
            {
              privacy === 'private' && !user.isPremium && user?.login===true ? (
                <Link
                  to={'/'}
                  onClick={() => {
                    Swal.fire({
                      title: 'Become a Premium Member!',
                      text: 'This blog is available for premium members only. Upgrade to our Premium membership for just Rs.499 and unlock access to exclusive tours.',
                      icon: 'info',
                      showCancelButton: true,
                      cancelButtonText: 'Cancel',
                      confirmButtonText: 'Upgrade',
                      reverseButtons: true
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handlePayment()
                      }
                    });
                  }}
                >
                  ...Read More
                </Link>
              ) : (
                <Link to={`/tour/${_id}`}>...Read More</Link>
              )}
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </MDBCardGroup>
  );
}

export default CardTour