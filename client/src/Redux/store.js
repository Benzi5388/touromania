import {configureStore} from "@reduxjs/toolkit";
import AuthReducer from './Features/authSlice';
import TourReducer from './Features/tourSlice';

export default configureStore({
    reducer : {
        auth : AuthReducer,
        tour : TourReducer,
    },
})

