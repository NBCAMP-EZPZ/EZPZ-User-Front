import axiosInstance from './axiosInstance';

// 좋아요한 팝업 목록을 가져오는 API
export const getLikedPopups = async (page = 0) => {
    const response = await axiosInstance.get(`/api/v1/likes?contentType=popup&page=${page}`);
    return response.data.data;
};

// 좋아요한 아이템 목록을 가져오는 API
export const getLikedItems = async (page = 0) => {
    const response = await axiosInstance.get(`/api/v1/likes?contentType=item&page=${page}`);
    return response.data.data;
};