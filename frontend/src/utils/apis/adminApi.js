import axiosClient from '../axiosClient';

export const getAllUsers = async () => {
    try {
        const response = await axiosClient.get('/auth/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getPlatformStats = async () => {
    try {
        const response = await axiosClient.get('/auth/platform-stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching platform stats:', error);
        throw error;
    }
};
