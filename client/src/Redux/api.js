import axios from 'axios';

const API = axios.create({baseURL : 'http://localhost:5000'});

export const signIn = (FormData) => API.post('/users/signin', FormData);
export const signUp = (FormData) => API.post('/users/signup', FormData);
export const verify = (FormData,token) => API.post('/users/otp', {FormData,token})
export const forgotPassword = (FormData) => API.post('/users/forgotPassword', FormData)
export const resetPassword = (FormData) => API.post('/users/resetPassword', FormData)
export const googleSignIn = (result) => API.post('/users/googleSignIn', result)

export const createTour = ({updatedTourData,file}) =>API.post('/tour', {updatedTourData,file})
