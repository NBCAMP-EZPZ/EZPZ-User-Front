import axiosInstance from './axiosInstance';

export const getLikedPopups = async (page = 0) => {
  const response = await axiosInstance.get(`/api/v1/likes?contentType=popup&page=${page}`);
  return response.data.data;
};

export const getLikedItems = async (page = 0) => {
  const response = await axiosInstance.get(`/api/v1/likes?contentType=item&page=${page}`);
  return response.data.data;
};