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
