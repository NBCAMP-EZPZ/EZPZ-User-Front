// src/api/popups.js

import axiosInstance from './axiosInstance';

export const getPopups = async (popupStatus = 'all', page = 0) => {
  try {
    const params = popupStatus === 'all' ? { page } : { popupStatus, page };
    const response = await axiosInstance.get('/api/v1/popups', { params });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getPopupDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/popups/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getReviews = async (id , page = 0) => {
  try {
    const response = await axiosInstance.get(`/api/v1/popups/${id}/reviews`, { params: { page } });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};