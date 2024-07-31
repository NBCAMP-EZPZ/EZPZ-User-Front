import axiosInstance from './axiosInstance';

export const addToCart = async (cartItem) => {
    try {
    const response = await axiosInstance.post('/api/v1/carts', cartItem);

    return response.data;
    } catch (error) {
    throw error;
    }
    };