// src/api/coupons.js

import axiosInstance from './axiosInstance';

export const getCoupons = async (page) => {
  const response = await axiosInstance.get(`/api/v1/coupons?page=${page}`);
  return response.data.data;
};

export const downloadCoupon = async (couponId) => {
    const response = await axiosInstance.post(`/api/v1/coupons/${couponId}`);
    return response.data; // 응답 데이터 반환
  };

  export const getMyCoupons = async (page) => {
    const response = await axiosInstance.get(`/api/v1/users/coupons?page=${page}`);
    return response.data.data;
  };