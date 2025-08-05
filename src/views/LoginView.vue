<template>
  <view class="login-container">
    <view class="login-header">
      <image class="login-logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="login-title">健康与运动</text>
      <text class="login-subtitle">登录您的账号</text>
    </view>
    
    <view class="login-form">
      <view class="input-group">
        <text class="input-label">用户名/邮箱</text>
        <input 
          class="input-field" 
          type="text" 
          v-model="username" 
          placeholder="请输入用户名或邮箱" 
        />
      </view>
      
      <view class="input-group">
        <text class="input-label">密码</text>
        <view class="password-container">
          <input 
            class="input-field" 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            placeholder="请输入密码" 
          />
          <text class="password-toggle" @click="togglePasswordVisibility">
            {{ showPassword ? '隐藏' : '显示' }}
          </text>
        </view>
      </view>
      
      <view class="remember-forgot">
        <view class="remember">
          <checkbox v-model="rememberMe" />
          <text>记住我</text>
        </view>
        <text class="forgot-link" @click="forgotPassword">忘记密码?</text>
      </view>
      
      <button 
        class="login-button" 
        :disabled="isLoading || !isFormValid" 
        @click="handleLogin"
      >
        {{ isLoading ? '登录中...' : '登录' }}
      </button>
      
      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">或者使用</text>
        <view class="divider-line"></view>
      </view>
      
      <view class="social-login">
        <view class="social-button wechat" @click="socialLogin('wechat')">
          <text class="iconfont icon-wechat"></text>
        </view>
        <view class="social-button qq" @click="socialLogin('qq')">
          <text class="iconfont icon-qq"></text>
        </view>
        <view class="social-button weibo" @click="socialLogin('weibo')">
          <text class="iconfont icon-weibo"></text>
        </view>
      </view>
      
      <view class="register-link">
        还没有账号? <text @click="goToRegister">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

const router = useRouter();
const store = useStore();

const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);

const isFormValid = computed(() => {
  return username.value && password.value;
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!isFormValid.value) {
    // TODO: 显示错误提示
    console.log('请输入用户名和密码');
    return;
  }
  
  try {
    isLoading.value = true;
    await store.dispatch('login', { username: username.value, password: password.value, remember: rememberMe.value });
    ElMessage.success('登录成功');
    router.push('/');
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '登录失败');
  } finally {
    isLoading.value = false;
  }
};

const forgotPassword = () => {
  // TODO: 导航到忘记密码页面
  console.log('忘记密码');
};

const socialLogin = (platform) => {
  // TODO: 实现社交媒体登录
  console.log(`使用${platform}登录`);
};

const goToRegister = () => {
  router.push('/register');
};

const goToResetPassword = () => {
  router.push('/reset-password');
};
</script>

<style>
.login-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 40rpx;
  background-color: #f5f5f7;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
  margin-top: 60rpx;
}

.login-logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.login-title {
  font-size: 46rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.login-subtitle {
  font-size: 28rpx;
  color: #666;
}

.login-form {
  background-color: #fff;
  border-radius: 30rpx;
  padding: 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);
}

.input-group {
  margin-bottom: 30rpx;
}

.input-label {
  display: block;
  font-size: 28rpx;
  margin-bottom: 10rpx;
  color: #666;
}

.input-field {
  width: 100%;
  height: 90rpx;
  border: 2rpx solid #e0e0e5;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
  background-color: #f9f9f9;
}

.password-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 26rpx;
  color: #6654e0;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.remember {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #666;
}

.forgot-link {
  font-size: 26rpx;
  color: #6654e0;
}

.login-button {
  width: 100%;
  height: 90rpx;
  border-radius: 10rpx;
  background-color: #6654e0;
  color: white;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
}

.login-button:disabled {
  background-color: #a99fe8;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.divider-line {
  flex: 1;
  height: 2rpx;
  background-color: #e0e0e5;
}

.divider-text {
  padding: 0 20rpx;
  font-size: 26rpx;
  color: #999;
}

.social-login {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
}

.social-button {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 20rpx;
}

.wechat {
  background-color: #07c160;
}

.qq {
  background-color: #12b7f5;
}

.weibo {
  background-color: #e6162d;
}

.iconfont {
  font-size: 40rpx;
  color: white;
}

.register-link {
  text-align: center;
  font-size: 26rpx;
  color: #666;
}

.register-link text {
  color: #6654e0;
  font-weight: bold;
}
</style> 