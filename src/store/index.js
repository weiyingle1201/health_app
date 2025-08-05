import { createStore } from 'vuex';
import { login, register } from '@/api/auth';

export default createStore({
    state: {
        token: uni.getStorageSync('token') || '',
        userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
        isAuthenticated: !!uni.getStorageSync('token')
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
            state.isAuthenticated = true;
            uni.setStorageSync('token', token);
        },
        SET_USER_INFO(state, userInfo) {
            state.userInfo = userInfo;
            uni.setStorageSync('userInfo', JSON.stringify(userInfo));
        },
        CLEAR_AUTH(state) {
            state.token = '';
            state.userInfo = {};
            state.isAuthenticated = false;
            uni.removeStorageSync('token');
            uni.removeStorageSync('userInfo');
        }
    },
    actions: {
        async login({ commit }, loginData) {
            try {
                const response = await login(loginData);
                const { token, userInfo } = response.data;
                commit('SET_TOKEN', token);
                commit('SET_USER_INFO', userInfo);
                return response;
            } catch (error) {
                throw error;
            }
        },
        async register({ commit }, registerData) {
            try {
                const response = await register(registerData);
                const { token, userInfo } = response.data;
                commit('SET_TOKEN', token);
                commit('SET_USER_INFO', userInfo);
                return response;
            } catch (error) {
                throw error;
            }
        },
        logout({ commit }) {
            commit('CLEAR_AUTH');
        }
    },
    getters: {
        isAuthenticated: state => state.isAuthenticated,
        userInfo: state => state.userInfo
    }
}); 