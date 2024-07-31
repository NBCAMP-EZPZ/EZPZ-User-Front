import axiosInstance from './axiosInstance';

// 주문 목록을 가져오는 API
export const getOrders = async (page = 0) => {
    try {
        const response = await axiosInstance.get('/api/v1/orders', {
            params: { page }
        });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// 주문 상세 정보를 가져오는 API
export const getOrderDetails = async (orderId) => {
    try {
        const response = await axiosInstance.get(`/api/v1/orders/${orderId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// 주문 생성 API
export const createOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post('/api/v1/orders', orderData);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

// 주문 취소 API
export const cancelOrder = async (orderId) => {
    try {
        const response = await axiosInstance.patch(`/api/v1/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};