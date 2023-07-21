// import {configureStore} from "@reduxjs/toolkit";
// import AuthReducer from './Features/authSlice';
// import TourReducer from './Features/tourSlice';
// import AdminReducer from './Features/adminSlice';


// export default configureStore({
//     reducer : {
//         auth : AuthReducer,
//         tour : TourReducer,
//         admin : AdminReducer,
//     },
// })

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Import the storage type you want to use (e.g., localStorage, sessionStorage)
import AuthReducer from './Features/authSlice';
import TourReducer from './Features/tourSlice';
import AdminReducer from './Features/adminSlice';

const persistConfig = {
    key: 'root',
    storage,
    // Add any additional configuration options as needed
  };

  const persistedAuthReducer = persistReducer(persistConfig, AuthReducer);
const persistedTourReducer = persistReducer(persistConfig, TourReducer);
const persistedAdminReducer = persistReducer(persistConfig, AdminReducer);

const store = configureStore({
    reducer: {
      auth: persistedAuthReducer,
      tour: persistedTourReducer,
      admin: persistedAdminReducer,
    },
  });

  const persistor = persistStore(store);

  export { store, persistor };

