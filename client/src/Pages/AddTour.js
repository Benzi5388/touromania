import React, {useEffect, useState} from 'react';
import {MDBCardBody, MDBCard, MDBValidation, MDBBtn} from 'mdb-react-ui-kit';
import ChipInput from 'material-ui-chip-input';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { setTours } from '../Redux/Features/tourSlice';
import { saveUserData } from '../Redux/Features/authSlice';
import axios from 'axios';
import Header from '../Components/Header';
import '../App.css'

const AddEditTour = () => {
 const [title, setTitle] = useState('');
 const [file, setImage] = useState('');
 const [description, setDescription] = useState('');
 const [videoUrl, setVideoUrl] = useState('');
 const [tags, setTag] = useState([]);
const { error, loading } = useSelector((state) => state.tour);
const user = useSelector((state) => (state.auth.user))
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);

 useEffect(() => {
  const user = localStorage.getItem('user');
  if (!user) {
    navigate('/login'); // Navigate to the home route
  }
}, [user, navigate]);

 useEffect(()=>{
  error && toast.error(error)
}, [error]);

 const handleSubmit =(e)=>{
   e.preventDefault();
   if(title && description){
     const updatedTourData = {title,description,file, tags, videoUrl, name: user?.name, creator : user?.id}
     console.log(user, "user");
     axios.post("http://localhost:5000/tour", updatedTourData,{
      headers: {
          'content-type': 'multipart/form-data'
      }
  }).then((response)=>{
console.log(response.data);
dispatch(setTours(response.data))
toast.success(response.data.message)
navigate('/');
     }).catch(error)
    //  handleClear()
   }
 }

 const handleAddTag =(tag)=>{
  setTag([...tags, tag]);
 }

 const handleDeleteTag =(deleteTag)=>{
  setTag(tags.filter((tag) => tag !== deleteTag));
 }

 const handleSearch = async (searchQuery) => {
  try {
    const response = await axios.get(`http://localhost:5000/tour/?page=${currentPage}&search=${searchQuery}`);
    dispatch(setTours(response.data.tours));
    setTotalPages(response.data.totalPages);
    navigate('/')
  } catch (error) {
    console.error(error);
  }
};

 const handleClear = () => {
  setTitle('');
  setDescription('');
  setTag([]);
  setVideoUrl('');
};
  return (
    <>
    <Header handleSearch={handleSearch}/>
    <div className='header-container'>
           <MDBCard alignment='center'>
             <h5>Add Tour</h5>
             <MDBCardBody>
             <MDBValidation onSubmit={handleSubmit} className='row g-3' noValidate>
              <div className="col-md-12">
                <input
                placeholder='Enter a title'
                type='text'
                value={title}
                name ='title'
                onChange={(e)=>setTitle(e.target.value)}
                className='form-control'
                invalid
                validation='Please provide title'
                />
              </div>
              <div className="col-md-12 description">
                <textarea
                placeholder='Enter description'
                type='text'
                value={description}
                name ='description'
                onChange={(e)=>setDescription(e.target.value)}
                className='form-control'
                invalid
                validation='Please provide some description'
                />
              </div>
              <div className="col-md-12">
                <ChipInput
                 name='tags'
                 variant='outlined'
                 placeholder='Enter a tag'
                 fullWidth
                 value={tags}
                 onAdd={(tag)=>handleAddTag(tag)}
                 onDelete={(tag)=>handleDeleteTag(tag)}
                />
              </div>
              <div className="col-md-12">
              <input
                placeholder="Enter video URL"
                type="text"
                value={videoUrl}
                name="videoUrl"
                onChange={(e) => setVideoUrl(e.target.value)}
                className="form-control"
              />
            </div>
              <div className="d-flex justify-content-start">
              <input type="file" name="file" onChange={(e)=>setImage(e.target.files[0])} className='mt-4 mb-2' accept='image/*' />
              </div>
              <div className="col-12">
                <MDBBtn className="add-button">Submit</MDBBtn>
                <MDBBtn className='mt-2 add-button' color='danger' onClick={handleClear}>Clear</MDBBtn>
              </div>
             </MDBValidation>
             </MDBCardBody>
           </MDBCard>
      </div>
      </>
  )
}

export default AddEditTour
