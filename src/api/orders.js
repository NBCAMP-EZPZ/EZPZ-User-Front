// src/api/orders.js

import axiosInstance from './axiosInstance';

export const getOrders = async (page = 0) => {
  try {
    const response = await axiosInstance.get('/api/v1/orders', {
      params: { page }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};