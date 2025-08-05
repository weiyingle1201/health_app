import request from '@/utils/request';

export const login = (data) => {
    return request.post('/auth/login', data);
};

export const register = (data) => {
    return request.post('/auth/register', data);
};

export const sendVerificationCode = (data) => {
    return request.post('/auth/verification-code', data);
};

export const resetPassword = (data) => {
    return request.post('/auth/reset-password', data);
}; 