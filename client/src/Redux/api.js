import axios from 'axios';

// const instance = axios.create({
//     baseURL: 'http://localhost:5000',
//   });

//   const tokenCache = {
//     token: null, // Initialize token as null
//     setToken(token) {
//       this.token = token; // Set the token in the cache
//     },
//     getToken() {
//       return this.token; // Get the token from the cache
//     },
//   };
// // Add an interceptor to include the authorization token in the request headers
// instance.interceptors.request.use(
//     (config) => {
//       const adminToken = tokenCache.getAdminToken(); // Get the admin token from the cache
//       if (adminToken) {
//         config.headers.Authorization = `Bearer ${adminToken}`; // Include the admin token in the request headers
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );
  
//   export const API = instance;

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

// USER REQUEST

export const API = axios.create({
      baseURL: 'https://touromania.unitedwestand.online',
    });

export const getUser = (userId) => API.get(`/chat/user/${userId}`);
export const getUsers = () => API.get(`/chat/`);

// CHAT API
export const createChat = (data) => API.post('/chat/', data);

export const userChats = (id) => API.get(`/chat/${id}`);

export const findChat = (firstId, secondId) => API.get(`/chat/find/${firstId}/${secondId}`);

//MESSAGE API

export const getMessages = (id) => API.get(`/message/${id}`);

export const addMessage = (data) => API.post('/message/', data);