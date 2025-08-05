import request from '@/utils/request';

/**
 * 获取健康数据统计
 * @param {Object} params - 查询参数
 * @param {string} params.type - 统计类型
 * @param {string} params.period - 统计周期：day/week/month
 */
export const getHealthStats = (params) => {
    return request.get('/stats', params);
};