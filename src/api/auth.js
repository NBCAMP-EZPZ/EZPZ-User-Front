import axiosInstance from './axiosInstance';

// 로그인 API
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

// 회원가입 API
export const signup = async (userData) => {
    try {
        const response = await axiosInstance.post('/api/v1/signup', userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// 로그아웃 API
export const logout = async () => {
    try {
        const response = await axiosInstance.post('/api/v1/logout');

        return response.data;
    } catch (error) {
        throw error;
    }
}