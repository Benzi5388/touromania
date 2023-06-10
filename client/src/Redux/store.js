import {configureStore} from "@reduxjs/toolkit";
import AuthReducer from './Features/authSlice';

export default configureStore({
    reducer : {
        auth : AuthReducer,
    },
})