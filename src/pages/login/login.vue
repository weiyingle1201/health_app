<template>
  <view class="login-page">
    <view class="login-container">
      <view class="logo">
        <image src="/static/logo.png" mode="aspectFit" class="logo-img"></image>
        <text class="logo-text">健康旅程</text>
      </view>

      <view class="form-group">
        <view class="input-group">
          <text class="icon">👤</text>
          <input 
            type="text" 
            v-model="phoneNumber" 
            placeholder="请输入手机号"
            @keypress.enter="handleLogin"
          />
        </view>
        <view class="input-group">
          <text class="icon">🔒</text>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            placeholder="请输入密码"
            @keypress.enter="handleLogin"
          />
          <text 
            class="toggle-password" 
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </text>
        </view>
      </view>

      <view class="actions">
        <button 
          class="login-btn" 
          @click="handleLogin"
          :disabled="!phoneNumber || !password"
        >
          登录
        </button>
        <view class="login-link">
          还没有账号？<text class="link" @click="toRegister">立即注册</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
import request from '@/utils/request'

export default {
  setup() {
    const phoneNumber = ref('')
    const password = ref('')
    const showPassword = ref(false)

    const handleLogin = async () => {
      if (!phoneNumber.value || !password.value) {
        uni.showToast({ title: '请输入手机号和密码', icon: 'none' });
        return;
      }

      // --- 开发模式：强制模拟登录成功并导航 ---
      console.log('DEV_MODE: Simulating login and navigating...');
      uni.setStorageSync('token', 'DUMMY_DEV_TOKEN_FOR_VIEWING_PAGES'); // 设置一个假的token
      
      // 触发 Vuex store 更新 (可选, 但推荐)
      // 注意: store实例可能需要从外部导入才能直接commit，或者依赖App.vue/页面自身的逻辑来基于storage更新store
      // store.commit('SET_TOKEN', 'DUMMY_DEV_TOKEN_FOR_VIEWING_PAGES');
      
      uni.showToast({
        title: '开发模式：模拟登录成功',
        icon: 'success',
        duration: 1500
      });

      // uni.reLaunch({
      //   url: '/pages/exercise/exercise' // 修改为跳转到运动页面
      // });
      uni.switchTab({
        url: '/pages/index/index'
      });
      // --- 开发模式结束 ---

      // 您仍然可以保留原始的API调用尝试，以便后续联调，但它的结果不会阻止上面的强制跳转
      try {
        console.log('Attempting actual API login call (will not block dev navigation)...');
        const responseData = await request.post('/auth/login', { 
          phone: phoneNumber.value, 
          password: password.value
        });
        
        if (responseData && responseData.token) {
          console.log('Actual API login successful, real token:', responseData.token);
          // 如果真实API调用成功，可以用真实token覆盖假的token
          uni.setStorageSync('token', responseData.token); 
          // 如果需要，也更新userInfo
          // if (responseData.userInfo) {
          //   uni.setStorageSync('userInfo', JSON.stringify(responseData.userInfo));
          //   // store.commit('SET_USER_INFO', responseData.userInfo);
          // }
        } else {
          const message = responseData && responseData.message ? responseData.message : '登录令牌获取失败';
          console.warn('Actual API login failed or no token:', message);
          // 可以在这里决定是否再次提示，但主要导航已完成
        }
      } catch (error) {
        const errorMessage = error && error.message ? error.message : '登录接口调用失败';
        console.error('Actual API login call error:', errorMessage);
        // uni.showToast({
        //   title: `API错误: ${errorMessage}`, // 可以用一个不同的提示来区分
        //   icon: 'none'
        // });
      }
    }

    const toRegister = () => {
      uni.navigateTo({
        url: '/pages/register/register'
      })
    }

    return {
      phoneNumber,
      password,
      showPassword,
      handleLogin,
      toRegister
    }
  }
}
</script>

<style>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6654e0 0%, #8e7bff 100%);
  padding: 40rpx;
}

.login-container {
  width: 100%;
  background: white;
  border-radius: 32rpx;
  padding: 80rpx 60rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.15);
}

.logo {
  text-align: center;
  margin-bottom: 80rpx;
}

.logo-img {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 32rpx;
}

.logo-text {
  font-size: 48rpx;
  color: #333;
  font-weight: bold;
}

.form-group {
  margin-bottom: 60rpx;
}

.input-group {
  position: relative;
  margin-bottom: 40rpx;
}

.input-group input {
  width: 100%;
  height: 90rpx;
  padding: 0 80rpx;
  border: 4rpx solid #eee;
  border-radius: 16rpx;
  font-size: 32rpx;
}

.input-group input:focus {
  border-color: #6654e0;
}

.icon {
  position: absolute;
  left: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 36rpx;
}

.toggle-password {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 36rpx;
  cursor: pointer;
}

.actions {
  text-align: center;
}

.login-btn {
  width: 100%;
  height: 90rpx;
  background-color: #6654e0;
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  margin-bottom: 40rpx;
  cursor: pointer;
}

.login-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-link {
  font-size: 28rpx;
  color: #666;
}

.login-link .link {
  color: #6654e0;
  cursor: pointer;
}
</style> 