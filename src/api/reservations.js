// src/api/reservations.js

import axiosInstance from './axiosInstance';

export const getReservations = async (status, page = 0) => {
  try {
    const response = await axiosInstance.get('/api/v1/reservations', {
      params: { status, page }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};