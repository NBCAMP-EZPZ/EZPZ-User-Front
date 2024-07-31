import axiosInstance from './axiosInstance';

// 쿠폰 목록을 가져오는 API
export const getCoupons = async (page) => {
    const response = await axiosInstance.get(`/api/v1/coupons?page=${page}`);
    return response.data.data;
};

// 쿠폰 다운로드 API
export const downloadCoupon = async (couponId) => {
    const response = await axiosInstance.post(`/api/v1/coupons/${couponId}`);
    return response.data; // 응답 데이터 반환
};

// 내 쿠폰 목록을 가져오는 API
export const getMyCoupons = async (page) => {
    const response = await axiosInstance.get(`/api/v1/users/coupons?page=${page}`);
    return response.data.data;
};