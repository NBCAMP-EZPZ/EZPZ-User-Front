import axiosInstance from './axiosInstance';

// 아이템 목록을 가져오는 API
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

// 아이템 상세 정보를 가져오는 API
export const getItemDetail = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/v1/items/${id}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// 아이템 좋아요 API
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