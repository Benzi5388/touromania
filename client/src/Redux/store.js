import {configureStore} from "@reduxjs/toolkit";
import AuthReducer from './Features/authSlice';
import TourReducer from './Features/tourSlice';
import AdminReducer from './Features/adminSlice';


export default configureStore({
    reducer : {
        auth : AuthReducer,
        tour : TourReducer,
        admin : AdminReducer,
    },
})

