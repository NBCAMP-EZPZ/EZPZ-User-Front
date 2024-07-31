import axiosInstance from './axiosInstance';

// 리뷰 생성 API
export const createReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post('/api/v1/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('리뷰 생성 실패');
  }
};