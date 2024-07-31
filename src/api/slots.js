import axios from 'axios';
import axiosInstance from './axiosInstance';

export const getSlots = async (popupId, status, page =  0) => {
  const response = await axiosInstance.get(`/api/v1/popups/${popupId}/slots`, {
    params: { status, page },
  });
    return response.data.data;
}
