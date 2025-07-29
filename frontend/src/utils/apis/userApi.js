import axiosClient from '../axiosClient';

export const updateProfile = (formData) => {
  return axiosClient.put('/user/updateProfile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const googleLogin = (token) => {
  return axiosClient.post('/user/googleLogin', { token });
};

export const signupWithVerification = (data) => {
  return axiosClient.post('/user/signupWithVerification', data);
};

export const verifySignupOTP = (email, otp) => {
  return axiosClient.post('/user/verifySignupOTP', { email, otp });
};

export const requestEmailVerificationOTP = (email) => {
  return axiosClient.post('/user/requestEmailVerificationOTP', { email });
};

export const requestPasswordResetOTP = (email) => {
  return axiosClient.post('/user/requestPasswordResetOTP', { email });
};

export const resetPassword = (email, otp, newPassword) => {
  return axiosClient.post('/user/resetPassword', { email, otp, newPassword });
};

export const changePassword = (oldPassword, newPassword) => {
  return axiosClient.post('/user/changePassword', { oldPassword, newPassword });
};
