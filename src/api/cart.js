import axiosInstance from './axiosInstance';

export const addToCart = async (cartItem) => {
    try {
    const response = await axiosInstance.post('/api/v1/carts', cartItem);

    return response.data;
    } catch (error) {
    throw error;
    }
    };


    export const getCartItems = async () => {
        try {
          const response = await axiosInstance.get('/api/v1/carts');
          
          return response.data.data;
        } catch (error) {
          throw error;
        }
      };
      
      export const updateCartItem = async (cartId, { quantity }) => {
        try {
          const response = await axiosInstance.patch(`/api/v1/carts/${cartId}`, { quantity });
          return response.data.data;
        } catch (error) {
          throw error;
        }
      };
      
      export const deleteCartItem = async (cartId) => {
        try {
          await axiosInstance.delete(`/api/v1/carts/${cartId}`);
        } catch (error) {
          throw error;
        }
      };