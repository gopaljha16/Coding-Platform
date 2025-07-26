
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
            return rejectWithValue(err.response?.data?.message || err.message || "Login failed");
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




import { requestEmailVerificationOTP, verifyEmailOTP, requestPasswordResetOTP, resetPassword, changePassword } from '../utils/apis/userApi';

export const requestEmailVerificationOTPThunk = createAsyncThunk(
  "auth/requestEmailVerificationOTP",
  async (email, { rejectWithValue }) => {
    try {
      const response = await requestEmailVerificationOTP(email);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const verifyEmailOTPThunk = createAsyncThunk(
  "auth/verifyEmailOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await verifyEmailOTP(email, otp);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const requestPasswordResetOTPThunk = createAsyncThunk(
  "auth/requestPasswordResetOTP",
  async (email, { rejectWithValue }) => {
    try {
      const response = await requestPasswordResetOTP(email);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const response = await resetPassword(email, otp, newPassword);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await changePassword(oldPassword, newPassword);
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
        requestEmailVerificationOTPLoading: false,
        requestEmailVerificationOTPError: null,
        requestEmailVerificationOTPSuccess: false,
        verifyEmailOTPLoading: false,
        verifyEmailOTPError: null,
        verifyEmailOTPSuccess: false,
        requestPasswordResetOTPLoading: false,
        requestPasswordResetOTPError: null,
        requestPasswordResetOTPSuccess: false,
        resetPasswordLoading: false,
        resetPasswordError: null,
        resetPasswordSuccess: false,
        changePasswordLoading: false,
        changePasswordError: null,
        changePasswordSuccess: false,
    },
    reducers: {
        resetUpdateProfileState: (state) => {
            state.updateProfileLoading = false;
            state.updateProfileError = null;
            state.updateProfileSuccess = false;
        },
        resetEmailVerificationState: (state) => {
            state.requestEmailVerificationOTPLoading = false;
            state.requestEmailVerificationOTPError = null;
            state.requestEmailVerificationOTPSuccess = false;
            state.verifyEmailOTPLoading = false;
            state.verifyEmailOTPError = null;
            state.verifyEmailOTPSuccess = false;
        },
        resetPasswordResetState: (state) => {
            state.requestPasswordResetOTPLoading = false;
            state.requestPasswordResetOTPError = null;
            state.requestPasswordResetOTPSuccess = false;
            state.resetPasswordLoading = false;
            state.resetPasswordError = null;
            state.resetPasswordSuccess = false;
        },
        resetChangePasswordState: (state) => {
            state.changePasswordLoading = false;
            state.changePasswordError = null;
            state.changePasswordSuccess = false;
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
    })

    // requestEmailVerificationOTP
    .addCase(requestEmailVerificationOTPThunk.pending, (state) => {
        state.requestEmailVerificationOTPLoading = true;
        state.requestEmailVerificationOTPError = null;
        state.requestEmailVerificationOTPSuccess = false;
    })
    .addCase(requestEmailVerificationOTPThunk.fulfilled, (state) => {
        state.requestEmailVerificationOTPLoading = false;
        state.requestEmailVerificationOTPSuccess = true;
    })
    .addCase(requestEmailVerificationOTPThunk.rejected, (state, action) => {
        state.requestEmailVerificationOTPLoading = false;
        state.requestEmailVerificationOTPError = action.payload;
        state.requestEmailVerificationOTPSuccess = false;
    })

    // verifyEmailOTP
    .addCase(verifyEmailOTPThunk.pending, (state) => {
        state.verifyEmailOTPLoading = true;
        state.verifyEmailOTPError = null;
        state.verifyEmailOTPSuccess = false;
    })
    .addCase(verifyEmailOTPThunk.fulfilled, (state) => {
        state.verifyEmailOTPLoading = false;
        state.verifyEmailOTPSuccess = true;
    })
    .addCase(verifyEmailOTPThunk.rejected, (state, action) => {
        state.verifyEmailOTPLoading = false;
        state.verifyEmailOTPError = action.payload;
        state.verifyEmailOTPSuccess = false;
    })

    // requestPasswordResetOTP
    .addCase(requestPasswordResetOTPThunk.pending, (state) => {
        state.requestPasswordResetOTPLoading = true;
        state.requestPasswordResetOTPError = null;
        state.requestPasswordResetOTPSuccess = false;
    })
    .addCase(requestPasswordResetOTPThunk.fulfilled, (state) => {
        state.requestPasswordResetOTPLoading = false;
        state.requestPasswordResetOTPSuccess = true;
    })
    .addCase(requestPasswordResetOTPThunk.rejected, (state, action) => {
        state.requestPasswordResetOTPLoading = false;
        state.requestPasswordResetOTPError = action.payload;
        state.requestPasswordResetOTPSuccess = false;
    })

    // resetPassword
    .addCase(resetPasswordThunk.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
        state.resetPasswordSuccess = false;
    })
    .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.resetPasswordLoading = false;
        state.resetPasswordSuccess = true;
    })
    .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload;
        state.resetPasswordSuccess = false;
    })

    // changePassword
    .addCase(changePasswordThunk.pending, (state) => {
        state.changePasswordLoading = true;
        state.changePasswordError = null;
        state.changePasswordSuccess = false;
    })
    .addCase(changePasswordThunk.fulfilled, (state) => {
        state.changePasswordLoading = false;
        state.changePasswordSuccess = true;
    })
    .addCase(changePasswordThunk.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.changePasswordError = action.payload;
        state.changePasswordSuccess = false;
    });
    }
})



export const { resetUpdateProfileState, resetEmailVerificationState, resetPasswordResetState, resetChangePasswordState } = authSlice.actions;

export default authSlice.reducer;
