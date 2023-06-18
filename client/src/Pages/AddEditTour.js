import React, {useEffect, useState} from 'react';
import {MDBCardBody, MDBCard, MDBFooter, MDBValidation, MDBBtn, MDBSpinner} from 'mdb-react-ui-kit';
import ChipInput from 'material-ui-chip-input';
import {toast} from 'react-toastify';
import FileBase from 'react-file-base64';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { createTour } from '../Redux/api';
import axios from 'axios';




const AddEditTour = () => {
 const [title, setTitle] = useState('');
 const [file, setImage] = useState('');
 const [description, setDescription] = useState('');
 const [tags, setTag] = useState([]);
 const {error, loading} = useSelector((state) => ({...state.tour}))
 const {user} = useSelector((state) => ({...state.auth}))
 const dispatch = useDispatch();
 const navigate = useNavigate()


 useEffect(()=>{
  error && toast.error(error)
}, [error]);

 const handleSubmit =(e)=>{
   e.preventDefault();
   if(title && description){
     const updatedTourData = {title,description,file}
     console.log(file,updatedTourData);
     axios.post("http://localhost:5000/tour",{title,description,file},{
      headers: {
          'content-type': 'multipart/form-data'
      }
  }).then((response)=>{
console.log(response.data);
toast.success(response.data.message)
navigate('/');
     }).catch(error)
    //  handleClear()
   }
 }
 const handleAddTag =(tag)=>{
  setTag(tag)
 }
 const handleDeleteTag =(deleteTag)=>{
  setTag(tags.filter((tag)=> tag!==deleteTag))
 }
 const handleClear =()=>{
  // setTourData({title :'',  description:'', tags:[],image:''})
 }
  return (
    <div style={{
      margin : "auto", 
      padding : '15px',
      maxWidth : '450px', 
      alignContent :"center",
      marginTop :'120px'  }}
      className='container'>
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
              <div className="col-md-12">
                <textarea
                style={{height:'100px'}}
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
              
                //  onAdd={(tag)=>handleAddTag(tag)}
                //  onDelete={(tag)=>handleDeleteTag(tag)}
                />
              </div>
              <div className="d-flex justify-content-start">
              <input type="file" onChange={(e)=>setImage(e.target.files[0])} className='mt-4 mb-2' accept='image/*' />
              </div>
              <div className="col-12">
                <MDBBtn style={{width:'100%'}}>Submit</MDBBtn>
                <MDBBtn style={{width:'100%'}} className='mt-2' color='danger' onClick={handleClear}>Clear</MDBBtn>
              </div>
             </MDBValidation>
             </MDBCardBody>
           </MDBCard>
      </div>
  )
}

export default AddEditTour