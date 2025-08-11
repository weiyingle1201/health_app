<template>
  <view class="profile-page">
    <view class="header">
      <text class="header-title">个人中心</text>
    </view>

    <view class="profile-content">
      <view class="user-info-card" @click="goToEditPage">
        <view class="avatar-wrapper">
          <image :src="userInfo.avatar" mode="aspectFill"></image>
        </view>

        <view class="info-wrapper">
          <view class="username">{{ userInfo.username }}</view>

          <view class="details-wrapper">
            <view class="detail-item">
              <text>{{ userInfo.gender }}</text>
            </view>
            <view class="detail-item">
              <text>{{ userInfo.height }}cm</text>
            </view>
            <view class="detail-item">
              <text>{{ userInfo.weight }}kg</text>
            </view>
            <view class="detail-item">
              <text>{{ userInfo.age }}岁</text>
            </view>
          </view>
        </view>

        <view class="arrow-wrapper">
          <text class="arrow">›</text>
        </view>
      </view>

      <view class="menu-list">
        <view class="menu-item" @click="navigateTo('/pages/stats/stats')">
          <text class="menu-icon">📊</text>
          <text class="menu-text">数据统计</text>
          <text class="menu-arrow">›</text>
        </view>

        <view class="menu-item" @click="navigateTo('/pages/settings/settings')">
          <text class="menu-icon">⚙️</text>
          <text class="menu-text">设置</text>
          <text class="menu-arrow">›</text>
        </view>

        <view class="menu-item" @click="navigateTo('/pages/help/help')">
          <text class="menu-icon">❓</text>
          <text class="menu-text">帮助与反馈</text>
          <text class="menu-arrow">›</text>
        </view>

        <view class="menu-item" @click="navigateTo('/pages/about/about')">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>

      <button class="logout-btn" @click="logout">退出登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        username: '用户1201',
        avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        gender: '女',
        height: 168,
        weight: 52,
        age: 21
      }
    }
  },
  methods: {
    navigateTo(url) {
      uni.navigateTo({
        url
      });
    },
    goToEditPage() {
      console.log('准备跳转到编辑页...');
      uni.navigateTo({
        // 请确保你的 pages.json 中有这个路径
        url: '/pages/profile/edit'
      });
    },
    logout() {
      // 退出登录逻辑
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除登录信息
            uni.redirectTo({
              url: '/pages/login/login'
            });
          }
        }
      });
    }
  }
}
</script>

<style>
.profile-page {
  padding: 40rpx;
}

.header {
  margin-bottom: 60rpx;
}

.header-title {
  font-size: 48rpx;
  font-weight: bold;
}

.user-info-card {
	display: flex;
	align-items: center; /* 垂直居中对齐 */
	background-color: #fff;
	padding: 30rpx;
	border-radius: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
	margin-bottom: 20rpx; /* 和其他元素的间距 */
}

.avatar-wrapper {
	margin-right: 30rpx; /* 头像和右侧信息的间距 */
}

.avatar-wrapper image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
}

.info-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column; /* 内部元素（用户名、详情）垂直排列 */
	justify-content: center; /* 垂直方向居中 */
}

.username {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 15rpx; /* 用户名和下方详情的间距 */
}

/* 详情（性别、身高...）的容器，也设置为flex布局 */
.details-wrapper {
	display: flex;
	align-items: center;
	flex-wrap: wrap; /* 如果屏幕太窄，允许换行 */
}

.detail-item {
	font-size: 26rpx;
	color: #666;
	display: flex; /* 让分隔线可以垂直居中 */
	align-items: center;
}

/* 使用 ::after 伪元素来创建分隔线，比在模板里写 | 更优雅 */
.detail-item:not(:last-child)::after {
	content: '|';
	color: #e0e0e0;
	margin: 0 12rpx; /* 分隔线的左右间距 */
}

.arrow-wrapper .arrow {
	color: #ccc;
	font-size: 40rpx;
}

.menu-list {
  background: white;
  border-radius: 24rpx;
  margin-bottom: 60rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid #f5f5f7;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 30rpx;
}

.menu-text {
  flex: 1;
  font-size: 32rpx;
}

.menu-arrow {
  color: #999;
  font-size: 40rpx;
}

.logout-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: bold;
}
</style>
