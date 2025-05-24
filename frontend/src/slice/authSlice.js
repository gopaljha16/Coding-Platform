import { createSlice , createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../utils/axiosClient'

// api's
export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData , {rejectWithValue}) =>{
        try{
            const response = await axiosClient.post("/user/register" , userData);//the user data which will be sended to to backend process stores in db and give us an response
            return response.data.user;
        }catch(err){
            return rejectWithValue(err);
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials , {rejectWithValue}) =>{
        try{
            const response = await axiosClient.post("/user/login" , credentials);
            return response.data.user;
        }catch(err){
            return rejectWithValue(err);
        }
    }
)

export const logutUser = createAsyncThunk(
    "auth/logout",
    async (_ , {rejectWithValue}) =>{
        try{
            const response = await axiosClient.post("/user/logout");
            return response.data.user;
        }catch(err){
            return rejectWithValue(err);
        }
    }
)

export const checkAuth = createAsyncThunk(
    "auth/check",
   async (_ , {rejectWithValue}) =>{//_becuase we are not sending empty no data is going to db saving something all token thing validation.
      try{
        const response = await axiosClient.get("/user/check");
        return response.data.user;
      }catch(err){
        return rejectWithValue(err);
      }
   }
)

//slice
const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:false,
        isAuthenticated:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder) =>{
        builder
         //register user cases
         .addCase(registerUser.pending , (state) =>{
            state.loading = true;
            state.error = null;
         })
         .addCase(registerUser.fulfilled , (state , action) =>{
            state.loading = false,
            state.isAuthenticated = !!action.payload;
            state.user = action.payload;
         })
         .addCase(registerUser.rejected , (state , action) =>{
             state.loading = false;
             state.error = action.payload?.message || "Something Went Wrong";
             state.isAuthenticated = false;
             state.user = null;
         })

         //login user cases
         .addCase(loginUser.pending , (state) =>{
            state.loading = true,
            state.error = null;
         })
         .addCase(loginUser.fulfilled , (state , action ) =>{
            state.loading = false;
            state.isAuthenticated = !!action.payload;
            state.user = action.payload;
         }) 
         .addCase(loginUser.rejected , (state , action) =>{
            state.loading = false;
            state.error = action.payload?.message || "Something Went Wrong";
            state.isAuthenticated = false;
            state.user = null;
         })

         //logout user
         .addCase(logutUser.pending , (state) =>{
            state.loading = true;
            state.error = null;
         })
         .addCase(logutUser.fulfilled , (state ) =>{
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
         })
         .addCase(logutUser.rejected , (state , action ) =>{
             state.loading = false;
             state.error = action.payload?.message || "Something Went Wrong";
             state.user = null;
             state.isAuthenticated = false;
         })

         //check auth
         .addCase(checkAuth.pending , (state) =>{
            state.loading = true,
            state.error = null;
         })
         .addCase(checkAuth.fulfilled , (state , action) =>{
            state.loading = false;
            state.isAuthenticated = !!action.payload;
            state.user = action.payload;
         }) 
         .addCase(checkAuth.rejected , (state, action) =>{
            state.loading = false,
            state.error = action.payload?.message || "Something Went Wrong";
            state.isAuthenticated = false;
            state.user = null;
         })
    }
})

export default authSlice.reducer;