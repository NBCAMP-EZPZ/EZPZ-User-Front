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

export const getOrderDetails = async (orderId) => {
    try {
      const response = await axiosInstance.get(`/api/v1/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  };

export const createOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post('/api/v1/orders', orderData);
        return response.data.data;
    } catch (error) {
        throw error;
    }
    }