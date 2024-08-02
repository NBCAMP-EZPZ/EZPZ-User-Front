import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// axios 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// axios 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // 여기서 리프레시 토큰 만료 시 로직을 처리합니다.
            alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
            localStorage.removeItem('accessToken'); // 만료된 토큰 제거
            window.location.href = '/login'; // 로그인 페이지로 리디렉션
        } else if (error.response && error.response.status === 403) {
            alert('권한이 없습니다. 로그인을 하고 시도해주세요.');
            window.location.href = '/login'; // 로그인 페이지로 리디렉션
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;