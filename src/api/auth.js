import axiosInstance from './axiosInstance';

export const login = async (username, password) => {
    try {
        const response = await axiosInstance.post('/api/v1/login', {
            username,
            password,
          });
        
          return response.data;
    } catch (error) {
        throw error;
    }
}

export const signup = async (userData) => {
    try {
      const response = await axiosInstance.post('/api/v1/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

export const logout = async () => {
    try {
      const response = await axiosInstance.post('/api/v1/logout');

      return response.data;
    } catch (error) {
      throw error;
    }
  }