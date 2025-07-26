
// Import googleLogin API
import { googleLogin as googleLoginApi } from '../utils/apis/userApi';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../utils/axiosClient'
import { updateProfile as updateProfileApi } from '../utils/apis/userApi';

// api's
export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/user/register", userData);//the user data which will be sended to to backend process stores in db and give us an response
            return response.data.user;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/user/login", credentials);
            return response.data.user;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const googleLoginUser = createAsyncThunk(
  "auth/googleLogin",
  async (token, { rejectWithValue }) => {
    try {
      const response = await googleLoginApi(token);
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const logutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/user/logout");
            return response.data.user;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

export const checkAuth = createAsyncThunk(
    "auth/check",
    async (_, { rejectWithValue }) => {//_becuase we are not sending empty no data is going to db saving something all token thing validation.
        try {
            const response = await axiosClient.get("/user/check");
            return response.data.user;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
)

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/user/getProfile"); 
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await updateProfileApi(formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);




//slice
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        isAuthenticated: false,
        error: null,
        profile: null,
        profileLoading: false,
        profileError: null,
        updateProfileLoading: false,
        updateProfileError: null,
        updateProfileSuccess: false,
    },
    reducers: {
        resetUpdateProfileState: (state) => {
            state.updateProfileLoading = false;
            state.updateProfileError = null;
            state.updateProfileSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            //register user cases
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false,
                    state.isAuthenticated = !!action.payload;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something Went Wrong";
                state.isAuthenticated = false;
                state.user = null;
            })

            //login user cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true,
                    state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload;
                state.user = action.payload;
            })
    .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something Went Wrong";
        state.isAuthenticated = false;
        state.user = null;
    })

    // Google login user cases
    .addCase(googleLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
    })
    .addCase(googleLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something Went Wrong";
        state.isAuthenticated = false;
        state.user = null;
    })

    //logout user
    .addCase(logutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(logutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
    })
    .addCase(logutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something Went Wrong";
        state.user = null;
        state.isAuthenticated = false;
    })

    //check auth
    .addCase(checkAuth.pending, (state) => {
        state.loading = true,
            state.error = null;
    })
    .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
    })
    .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false,
            state.error = action.payload?.message || "Something Went Wrong";
        state.isAuthenticated = false;
        state.user = null;
    })

    .addCase(getProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
    })
    .addCase(getProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        // Update both user and profile if needed
        state.profile = action.payload;
        // Update user info as well to ensure Navbar re-renders
        state.user = {
            ...state.user,
            ...action.payload.user
        };
    })
    .addCase(getProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
    })

    // update profile
    .addCase(updateProfile.pending, (state) => {
        state.updateProfileLoading = true;
        state.updateProfileError = null;
        state.updateProfileSuccess = false;
    })
    .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileSuccess = true;
        state.profile = action.payload.user;
        // Update user info as well to ensure Navbar re-renders
        state.user = {
            ...state.user,
            ...action.payload.user
        };
    })
    .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfileLoading = false;
        state.updateProfileError = action.payload;
        state.updateProfileSuccess = false;
    });
    }
})

export const { resetUpdateProfileState } = authSlice.actions;

export default authSlice.reducer;
