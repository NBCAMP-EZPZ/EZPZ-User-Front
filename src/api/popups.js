import axiosInstance from './axiosInstance';

// 팝업 목록을 가져오는 API
export const getPopups = async (popupStatus = 'all', page = 0) => {
  try {
    const params = popupStatus === 'all' ? { page } : { popupStatus, page };
    const response = await axiosInstance.get('/api/v1/popups', { params });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// 팝업 상세 정보를 가져오는 API
export const getPopupDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/popups/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// 팝업 리뷰 목록을 가져오는 API
export const getReviews = async (id, page = 0) => {
  try {
    const response = await axiosInstance.get(`/api/v1/popups/${id}/reviews`, { params: { page } });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// 팝업 좋아요 API
export const likePopup = async (id) => {
  try {
    const response = await axiosInstance.post('/api/v1/likes', {
      contentId: id,
      contentType: 'popup'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};