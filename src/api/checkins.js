import request from '@/utils/request';

export const submitCheckin = (data) => {
    return request.post('/checkins', data);
};

export const getCheckins = (params) => {
    return request.get('/checkins', params);
};

export const getCheckinReminders = () => {
    return request.get('/checkins/reminder');
};

export const setCheckinReminder = (data) => {
    return request.post('/checkins/reminder', data);
}; 