import axios from 'axios';

export const API = axios.create({baseURL : 'http://localhost:5000'});



// API.interceptors.request.use((req)=>{
//     if(localStorage.getItem("profile")){
//         req.headers.Authorization = `Bearer ${
//             JSON.parse(localStorage.getItem("profile")).token
//         }`
//     }
//     return req;
// })

// export const signIn = (FormData) => API.post('/users/signin', FormData);
// export const signUp = (FormData) => API.post('/users/signup', FormData);
// export const verify = (formValue, token) => API.post('/users/otp', { formValue, token });
// export const forgotPassword = (FormData) => API.post('/users/forgotPassword', FormData)
// export const resetPassword = (FormData) => API.post('/users/resetPassword', FormData)
// export const googleSignIn = (result) => API.post('/users/googleSignIn', result)

// export const createTour = ({updatedTourData,file}) =>API.post('/tour', {updatedTourData,file})
// // export const resendOTP = (email) => API.post(`/users/resendOTP`, { email });
// export const getTour = () =>API.get('/tour')
// export const getUser = () =>API.get('/user')
// export const updateTour = (id, updatedTourData) => API.patch(`/adminhome/${id}`, updatedTourData);




// export const adminlogin = (FormData) => API.post('/admin/adminlogin', FormData);