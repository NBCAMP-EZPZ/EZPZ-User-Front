import axiosInstance from './axiosInstance';

// 예약 목록을 가져오는 API
export const getReservations = async (status, page = 0) => {
  try {
    const response = await axiosInstance.get('/api/v1/reservations', {
      params: { status, page }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// 예약 상세 정보를 가져오는 API
export const getReservationDetails = async (reservationId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/reservations/${reservationId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// 예약 생성 API
export const createReservation = async (reservationData) => {
  try {
    const response = await axiosInstance.post('/api/v1/reservations', reservationData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// 예약 삭제 API
export const cancelReservation = async (reservationId) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};