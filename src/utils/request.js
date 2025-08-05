import axios from 'axios';

// 创建axios实例 (主要用于timeout等配置，baseURL由uniRequest处理)
const axiosInstance = axios.create({
    timeout: 5000,
});

const BASE_URL = 'http://localhost:8081'; // 后端服务的基础URL

// 创建请求拦截器
const uniRequest = (config) => {
    const { url, method = 'GET', data = {}, params = {}, headers = {} } = config;
    
    const token = uni.getStorageSync('token') || '';
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    let fullUrl = BASE_URL + url; // 使用定义好的 BASE_URL
    
    if (params && Object.keys(params).length > 0) {
        const query = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + query;
    }
    
    return new Promise((resolve, reject) => {
        uni.request({
            url: fullUrl,
            data,
            method: method.toUpperCase(),
            header: headers,
            success: (response) => {
                // 注意: uni.request 的 statusCode 是数字
                if (response.statusCode === 200) {
                    resolve(response.data); // 直接 resolve data 部分
                } else if (response.statusCode === 401) {
                    uni.removeStorageSync('token');
                    uni.showToast({
                        title: '登录已过期，请重新登录',
                        icon: 'none'
                    });
                    setTimeout(() => {
                        uni.navigateTo({
                            url: '/pages/login/login'
                        });
                    }, 1500);
                    reject(new Error('登录已过期')); // reject 一个 Error 对象
                } else {
                    // 其他错误，尝试从 response.data.message 获取信息
                    const errorMessage = response.data && response.data.message ? response.data.message : '请求失败';
                    uni.showToast({
                        title: errorMessage,
                        icon: 'none'
                    });
                    reject(new Error(errorMessage)); // reject 一个 Error 对象
                }
            },
            fail: (error) => {
                uni.showToast({
                    title: '网络请求失败',
                    icon: 'none'
                });
                reject(error);
            }
        });
    });
};

const api = {
    get: (url, params = {}, headers = {}) => {
        return uniRequest({ url, method: 'GET', params, headers });
    },
    post: (url, data = {}, headers = {}) => {
        return uniRequest({ url, method: 'POST', data, headers });
    },
    put: (url, data = {}, headers = {}) => {
        return uniRequest({ url, method: 'PUT', data, headers });
    },
    delete: (url, params = {}, headers = {}) => {
        return uniRequest({ url, method: 'DELETE', params, headers });
    }
};

export default api; 