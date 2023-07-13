import React, { useEffect } from 'react'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';

export default function UserAuthCallback() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch()
  const navigate= useNavigate()
  useEffect(()=>{
    (async function(){
      const token= searchParams.get('token')
      const {data}= await axios.get("/user/auth/google/verify?token="+token);
      if(!data.err){
        dispatch({type:"refresh"})
        navigate("/")
      }
      navigate("/login")
    })()


  },[])
  return (
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
  )
}