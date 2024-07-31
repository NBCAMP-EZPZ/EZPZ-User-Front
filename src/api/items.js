// src/api/items.js
import axiosInstance from './axiosInstance';

export const getItems = async (popupId, itemStatus, page = 0) => {
  try {
    const response = await axiosInstance.get('/api/v1/items', {
      params: { 
        popupId, 
        itemStatus, 
        page 
      }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getItemDetail = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/v1/items/${id}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const likeItem = async (itemId) => {
    try {
      const response = await axiosInstance.post(`/api/v1/likes`, {
        contentId: itemId,
        contentType: 'item'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };