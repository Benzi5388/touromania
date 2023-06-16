import {createSlice, createAsyncThunk, isRejectedWithValue} from "@reduxjs/toolkit";
import * as api from '../api';

export const login = createAsyncThunk('auth/login', async({formValue, navigate, toast}, {isRejectedWithValue})=>{
    try {
      const response = await api.signIn(formValue);
      toast.success('Logged in Successfully!!');
      navigate('/');
      return response.data
    } catch (err){
        console.log(err + 'this is the error');
        return isRejectedWithValue(err.response.data)
    }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async({formValue, navigate, toast}, {isRejectedWithValue})=>{
    try {
      const response = await api.forgotPassword(formValue);
      toast.success('Otp sent to your mail');
      navigate('/otp');
      return response.data
    } catch (err){
        console.log(err + 'this is the error');
        return isRejectedWithValue(err.response.data)
    }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async({formValue, navigate, toast}, {isRejectedWithValue})=>{
    try {
      const response = await api.resetPassword(formValue);
      toast.success('Logged in Successfully!!');
      navigate('/login');
      return response.data
    } catch (err){
        console.log(err + 'this is the error');
        return isRejectedWithValue(err.response.data)
    }
});

export const register = createAsyncThunk('auth/register', async({formValue, navigate, toast}, {isRejectedWithValue})=>{
    console.log(formValue, "form");
    try {
      const response = await api.signUp(formValue);
      toast.success('Registered Successfully!!');
      navigate('/otp');
      return response.data
    } catch (err){
        console.log(err + 'this is the error');
        return isRejectedWithValue(err.response.data)
    }
});

export const verify = createAsyncThunk('auth/verify', async ({formValue, navigate, toast, token}, {isRejectedWithValue})=>{
    console.log(formValue,333333);
    try {
      const response = await api.verify(formValue,token)
      toast.success('Registered Successfully!!');
      navigate('/login');
      return response.data
    } catch (err){
        console.log(err + 'this is the error');
        return isRejectedWithValue(err.response.data)
    }
});



export const googleSignIn = createAsyncThunk('auth/googleSignIn', async({result, navigate, toast}, {isRejectedWithValue})=>{
    try {
      const response = await api.googleSignIn(result);
      toast.success('google Sign In Successfull');
      navigate('/');
      return response.data
    } catch (err){
        console.log(err + 'this is the error');
        return isRejectedWithValue(err.response.data)
    }
});

const authSlice = createSlice({
    name : "auth",
    initialState : {
        user : null,
        error : "",
        loading : false,
    },
    reducers :{
        setUser : (state, action) =>{
            state.user = action.payload;
        },
        setLogout : (state, action) =>{
            localStorage.clear();
            state.user = null;
        }
    },
    extraReducers : {
        [login.pending]: (state, action)=>{
            state.loading = true
        },
        [login.fulfilled]:(state, action) =>{
            state.loading = false
            localStorage.setItem('profile', JSON.stringify({...action.payload}));
            state.user = action.payload
        },
        [login.rejected] : (state, action) =>{
            state.loading = false
            state.error = action.payload && action.payload.message ? action.payload.message : 'Invalid Credentials!!';
        },

        [register.pending]: (state, action)=>{
            state.loading = true
        },
        [register.fulfilled]:(state, action) =>{
            state.loading = false
            localStorage.setItem('profile', JSON.stringify({...action.payload}));
            state.user = action.payload
        },
        [register.rejected] : (state, action) =>{
            state.loading = false
            state.error = action.payload && action.payload.message ? action.payload.message : 'Invalid Credentials!!auth';
        },

        [forgotPassword.pending]: (state, action)=>{
            state.loading = true
        },
        [forgotPassword.fulfilled]:(state, action) =>{
            state.loading = false
            localStorage.setItem('profile', JSON.stringify({...action.payload}));
            state.user = action.payload
        },
        [forgotPassword.rejected] : (state, action) =>{
            state.loading = false
            state.error = action.payload && action.payload.message ? action.payload.message : 'Invalid Credentials!!auth';
        },

        [resetPassword.pending]: (state, action)=>{
            state.loading = true
        },
        [resetPassword.fulfilled]:(state, action) =>{
            state.loading = false
            localStorage.setItem('profile', JSON.stringify({...action.payload}));
            state.user = action.payload
        },
        [resetPassword.rejected] : (state, action) =>{
            state.loading = false
            state.error = action.payload && action.payload.message ? action.payload.message : 'Invalid Credentials!!auth';
        },

        [verify.pending]: (state, action)=>{
            state.loading = true
        },
        [verify.fulfilled]:(state, action) =>{
            state.loading = false
            localStorage.setItem('profile', JSON.stringify({...action.payload}));
            state.user = action.payload
        },
        [verify.rejected] : (state, action) =>{
            state.loading = false
            state.error = action.payload && action.payload.message ? action.payload.message : 'Invalid Credentials!!';
        },

        [googleSignIn.pending]: (state, action)=>{
            state.loading = true
        },
        [googleSignIn.fulfilled]:(state, action) =>{
            state.loading = false
            localStorage.setItem('profile', JSON.stringify({...action.payload}));
            state.user = action.payload
        },
        [googleSignIn.rejected] : (state, action) =>{
            state.loading = false
            state.error = action.payload && action.payload.message ? action.payload.message : 'Invalid Credentials!!';
        }
    }
})

export const {setUser, setLogout} = authSlice.actions
export default authSlice.reducer;