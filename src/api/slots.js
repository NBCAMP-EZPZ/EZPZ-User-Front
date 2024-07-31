import axiosInstance from './axiosInstance';

// 슬롯 목록을 가져오는 API
export const getSlots = async (popupId, status, page = 0) => {
    const response = await axiosInstance.get(`/api/v1/popups/${popupId}/slots`, {
        params: { status, page },
    });
    return response.data.data;
}
