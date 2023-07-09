import React, { useState, useEffect  } from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBCardGroup, MDBBtn, MDBIcon, MDBTooltip  } from 'mdb-react-ui-kit'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../App.css'
import axios from 'axios';
import { setNewTourState, setLikedTourIds } from '../Redux/Features/tourSlice';
import { useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

function CardTour({ title, location, description, tags, _id, name, image, createdAt, likes, userId }) {
  const [liked, setLiked] = useState(false);
  const likedTourIds = useSelector(state => state.tour.likedTourIds);
  const user = useSelector(state => state.auth.user);
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
      // User does not exist, redirect to login page
      return (
        <Link to="/login">
          <MDBIcon far icon="thumbs-up" />
          &nbsp;{likes.length} Like{likes.length !== 1 ? 's' : ''}
        </Link>
      );
    }
    if (likes.length > 0) {
      if (likes.includes(userId)) {
        return (
          <>
            <MDBIcon fas icon='thumbs-up' />
            &nbsp;
            {likes.length > 2 ? (
              <MDBTooltip content={`You and ${likes.length - 1} others like this`}>
              {likes.length}
            </MDBTooltip>
            ) : (
              `${likes.length} Like${likes.length > 1 ? 's' : ''}`
            )}
          </>
        );
      }
    }
  
    return (
      <>
        {liked ? (
          <MDBIcon far icon='thumbs-up' style={{ color: 'blue' }} />
        ) : (
          <MDBIcon fas icon='thumbs-up' />
        )}
        &nbsp;{likes.length} Like{likes.length !== 1 ? 's' : ''}
      </>
    );
  };
  
  

  useEffect(() => {
    const likedState = localStorage.getItem(`liked_${_id}`);
    if (likedState) {
      setLiked(JSON.parse(likedState));
    } else {
      // Check if the user ID is present in the likes array
      if (likes.includes(userId)) {
        setLiked(true);
      }
    }
  }, [_id, likes, userId]);

  const handlelike = async () => {
    try {
      const response = await axios.patch(`http://localhost:5000/tour/like/${_id}`);
      const updatedTour = response.data;
      console.log(updatedTour);
      const newLikedState = !liked;
      setLiked(newLikedState);
      dispatch(setNewTourState(updatedTour));
  
      // Update the likedTourIds in Redux store
      const updatedLikedTourIds = newLikedState
        ? [...likedTourIds, _id]
        : likedTourIds.filter((tourId) => tourId !== _id);
      dispatch(setLikedTourIds(updatedLikedTourIds));
  
      localStorage.setItem(`liked_${_id}`, JSON.stringify(newLikedState));
      navigate('/');
    } catch (error) {
      console.error('Error liking tour:', error);
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
        <span className='text-start tag-card'>{tags.map((item) => `#${item}`)}
          <MDBBtn style={{ float: "right" }} tag="a" color='none' onClick={handlelike}>
            <Likes />
          </MDBBtn>
          <div>
            <span className='created-at'>
              <i className='far fa-calendar-alt'></i>
              &nbsp;{/* Add a non-breaking space */}
              {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div>
            <span className='location bold-text'>
              <i className='fas fa-map-marker-alt'></i>
              &nbsp;{/* Add a non-breaking space */}
              {location}
            </span>
          </div>
        </span>
        <MDBCardBody >
          <MDBCardTitle className='text-start'>{title}</MDBCardTitle>
          <MDBCardText className='text-start'>{excerpt(description)}
            <Link to={`/tour/${_id}`}>...Read More</Link>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </MDBCardGroup>
  )
}

export default CardTour