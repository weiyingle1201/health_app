<template>
  <view class="register-page">
    <view class="register-container">
      <view class="logo">
        <image src="/static/logo.png" mode="aspectFit" class="logo-img"></image>
        <text class="logo-text">健康旅程</text>
      </view>

      <view class="form-group">
        <view class="input-group">
          <text class="icon">👤</text>
          <input 
            type="text" 
            v-model="username" 
            placeholder="请输入用户名"
          />
        </view>
        <view class="input-group">
          <text class="icon">📱</text>
          <input 
            type="number"
            v-model="phoneNumber" 
            placeholder="请输入手机号"
          />
        </view>
        <view class="input-group verification-group">
          <text class="icon">🔑</text>
          <input 
            type="text" 
            v-model="verificationCode" 
            placeholder="请输入验证码"
          />
          <text 
            class="get-code-btn" 
            @click="getVerificationCode"
            :class="{ 'disabled': isCodeSending || countdown > 0 }"
          >
            {{ codeButtonText }}
          </text>
        </view>
        <view class="input-group">
          <text class="icon">🔒</text>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            placeholder="请输入密码"
          />
          <text 
            class="toggle-password" 
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </text>
        </view>
        <view class="input-group">
          <text class="icon">🔒</text>
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            v-model="confirmPassword" 
            placeholder="请确认密码"
          />
          <text 
            class="toggle-password" 
            @click="showConfirmPassword = !showConfirmPassword"
          >
            {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
          </text>
        </view>
      </view>

      <view class="actions">
        <button 
          class="register-btn" 
          @click="handleRegister"
          :disabled="!isFormValid"
        >
          注册
        </button>
        <view class="login-link">
          已有账号？<text class="link" @click="toLogin">返回登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import request from '@/utils/request'

const username = ref('')
const phoneNumber = ref('')
const password = ref('')
const confirmPassword = ref('')
const verificationCode = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isCodeSending = ref(false)
const countdown = ref(0)

const codeButtonText = computed(() => {
  if (countdown.value > 0) {
    return `${countdown.value}秒后重试`
  }
  return '获取验证码'
})

const isFormValid = computed(() => {
  return username.value && 
         phoneNumber.value &&
         verificationCode.value &&
         password.value && 
         confirmPassword.value && 
         password.value === confirmPassword.value;
})

const getVerificationCode = async () => {
  if (isCodeSending.value || countdown.value > 0 || !phoneNumber.value) {
    if (!phoneNumber.value) {
      uni.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
    }
    return;
  }
  
  try {
    isCodeSending.value = true
    const response = await request({
      url: '/auth/verification-code',
      method: 'POST',
      data: {
        phone: phoneNumber.value
      }
    })
    
    if (response.statusCode === 200) {
      uni.showToast({
        title: '验证码已发送',
        icon: 'success'
      })
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } else {
      throw new Error(response.data.message || '获取验证码失败')
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '获取验证码失败',
      icon: 'none'
    })
  } finally {
    isCodeSending.value = false
  }
}

const handleRegister = async () => {
  if (!isFormValid.value) return;
  
  if (password.value !== confirmPassword.value) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    });
    return;
  }
  
  try {
    const response = await request({
      url: '/auth/register',
      method: 'POST',
      data: {
        username: username.value,
        phone: phoneNumber.value,
        password: password.value,
        verificationCode: verificationCode.value
      }
    });

    if (response.statusCode === 200 || response.statusCode === 201) {
      uni.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 2000,
      });
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/login/login'
        });
      }, 1500);
    } else {
      throw new Error(response.data.message || '注册失败');
    }
  } catch (error) {
    uni.showToast({
      title: error.message || '注册失败，请稍后重试',
      icon: 'none'
    });
  }
}

const toLogin = () => {
  uni.navigateBack();
}
</script>

<style>
.register-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6654e0 0%, #8e7bff 100%);
  padding: 40rpx;
}

.register-container {
  width: 100%;
  background: white;
  border-radius: 32rpx;
  padding: 80rpx 60rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.15);
}

.logo {
  text-align: center;
  margin-bottom: 60rpx;
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
}

.verification-group {
  /* 与其他input-group保持一致 */
}

.get-code-btn {
  position: absolute;
  right: 10rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 26rpx;
  color: #6654e0;
  padding: 10rpx 15rpx;
  border: 2rpx solid #6654e0;
  border-radius: 8rpx;
  background-color: white;
  z-index: 10;
}

.get-code-btn.disabled {
  color: #999;
  border-color: #999;
  background-color: #f5f5f5;
}

.register-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background: #6654e0;
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.register-btn[disabled] {
  background: #ccc;
}

.login-link {
  text-align: center;
  margin-top: 40rpx;
  color: #666;
  font-size: 28rpx;
}

.link {
  color: #6654e0;
  font-weight: bold;
}
</style>