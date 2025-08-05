import request from '@/utils/request';

export const setGoals = (data) => {
    return request.post('/goals/set', data);
};

export const getGoals = () => {
    return request.get('/goals');
};

export const getGoalsProgress = (params) => {
    return request.get('/goals/progress', params);
}; 