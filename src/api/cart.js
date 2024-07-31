import axiosInstance from './axiosInstance';

// 장바구니에 상품을 추가하는 API
export const addToCart = async (cartItem) => {
    try {
        const response = await axiosInstance.post('/api/v1/carts', cartItem);

        return response.data;
    } catch (error) {
        throw error;
    }
};

// 장바구니에 담긴 상품 목록을 가져오는 API
export const getCartItems = async () => {
    try {
        const response = await axiosInstance.get('/api/v1/carts');

        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// 장바구니에 담긴 상품을 수정하는 API
export const updateCartItem = async (cartId, { quantity }) => {
    try {
        const response = await axiosInstance.patch(`/api/v1/carts/${cartId}`, { quantity });
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// 장바구니에 담긴 상품을 삭제하는 API
export const deleteCartItem = async (cartId) => {
    try {
        await axiosInstance.delete(`/api/v1/carts/${cartId}`);
    } catch (error) {
        throw error;
    }
};