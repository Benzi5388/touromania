import {createSlice, createAsyncThunk, isRejectedWithValue} from "@reduxjs/toolkit";
import * as api from '../api';

export const createTour = createAsyncThunk(
    'tour/createTour',
 async({updatedTourData, navigate, toast,image})=>{
    try {
      const response = await api.createTour(updatedTourData,image);
      toast.success('Tour added Successfully!!');
      navigate('/');
      return response.data
    } catch (err){
        console.log(err + 'this is the error');
        return isRejectedWithValue(err.response.data)
    }
});

const tourSlice = createSlice({
    name : "tour",
    initialState : {
        tour : {},
        tours : [],
        userTours:[],
        error : "",
        loading : false,
    },
    extraReducers : {
        [createTour.pending]: (state, action)=>{
            state.loading = true
        },
        [createTour.fulfilled]:(state, action) =>{
            state.loading = false
            state.tours = [action.payload]
        },
        [createTour.rejected] : (state, action) =>{
            state.loading = false
            state.error = action.payload && action.payload.message ? action.payload.message : 'Invalid Credentials!!';
        }
    }
})

export default tourSlice.reducer