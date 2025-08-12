<template>
  <view class="help-page">
    <!-- 顶部导航 -->
    <view class="header">
      <text class="header-title">帮助与反馈</text>
      <text class="header-subtitle">我们随时为您提供帮助</text>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content" scroll-y="true">
      <!-- 快速帮助 -->
      <view class="quick-help">
        <view class="section-title">快速帮助</view>
        <view class="help-grid">
          <view class="help-item" @click="showHelpDetail('usage')">
            <view class="help-icon">📖</view>
            <text class="help-text">使用指南</text>
          </view>
          <view class="help-item" @click="showHelpDetail('faq')">
            <view class="help-icon">❓</view>
            <text class="help-text">常见问题</text>
          </view>
          <view class="help-item" @click="showHelpDetail('contact')">
            <view class="help-icon">📞</view>
            <text class="help-text">联系我们</text>
          </view>
          <view class="help-item" @click="showFeedback">
            <view class="help-icon">💬</view>
            <text class="help-text">意见反馈</text>
          </view>
        </view>
      </view>

      <!-- 常见问题 -->
      <view class="faq-section">
        <view class="section-title">常见问题</view>
        <view class="faq-list">
          <view 
            v-for="(faq, index) in faqList" 
            :key="index"
            class="faq-item"
            @click="toggleFaq(index)"
          >
            <view class="faq-header">
              <text class="faq-question">{{ faq.question }}</text>
              <view class="faq-arrow" :class="{ expanded: faq.expanded }">›</view>
            </view>
            <view class="faq-answer" v-if="faq.expanded">
              <text>{{ faq.answer }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 使用指南 -->
      <view class="guide-section">
        <view class="section-title">使用指南</view>
        <view class="guide-list">
          <view 
            v-for="(guide, index) in guideList" 
            :key="index"
            class="guide-item"
          >
            <view class="guide-icon">{{ guide.icon }}</view>
            <view class="guide-content">
              <text class="guide-title">{{ guide.title }}</text>
              <text class="guide-desc">{{ guide.description }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="contact-section">
        <view class="section-title">联系我们</view>
        <view class="contact-list">
          <view class="contact-item" @click="copyEmail">
            <view class="contact-icon">📧</view>
            <view class="contact-info">
              <text class="contact-label">邮箱</text>
              <text class="contact-value">support@healthapp.com</text>
            </view>
            <view class="contact-action">复制</view>
          </view>
          
          <view class="contact-item" @click="copyWechat">
            <view class="contact-icon">💬</view>
            <view class="contact-info">
              <text class="contact-label">微信客服</text>
              <text class="contact-value">HealthApp_Service</text>
            </view>
            <view class="contact-action">复制</view>
          </view>
          
          <view class="contact-item" @click="callService">
            <view class="contact-icon">📞</view>
            <view class="contact-info">
              <text class="contact-label">客服热线</text>
              <text class="contact-value">400-123-4567</text>
            </view>
            <view class="contact-action">拨打</view>
          </view>
        </view>
      </view>

      <!-- 应用信息 -->
      <view class="app-info">
        <view class="info-item">
          <text class="info-label">当前版本</text>
          <text class="info-value">v1.0.0</text>
        </view>
        <view class="info-item">
          <text class="info-label">更新时间</text>
          <text class="info-value">2024年1月15日</text>
        </view>
        <view class="info-item">
          <text class="info-label">开发者</text>
          <text class="info-value">健康科技团队</text>
        </view>
      </view>
    </scroll-view>

    <!-- 反馈弹窗 -->
    <view class="feedback-modal" v-if="showFeedbackModal" @click="closeFeedback">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">意见反馈</text>
          <view class="modal-close" @click="closeFeedback">×</view>
        </view>
        
        <view class="feedback-form">
          <view class="form-group">
            <text class="form-label">反馈类型</text>
            <view class="type-selector">
              <view 
                v-for="(type, index) in feedbackTypes" 
                :key="index"
                class="type-item"
                :class="{ active: selectedFeedbackType === type.value }"
                @click="selectFeedbackType(type.value)"
              >
                <text>{{ type.label }}</text>
              </view>
            </view>
          </view>
          
          <view class="form-group">
            <text class="form-label">反馈内容</text>
            <textarea 
              v-model="feedbackContent" 
              placeholder="请详细描述您的问题或建议..."
              class="feedback-textarea"
            />
          </view>
          
          <view class="form-group">
            <text class="form-label">联系方式（选填）</text>
            <input 
              v-model="feedbackContact" 
              placeholder="邮箱或手机号，方便我们回复您"
              class="feedback-input"
            />
          </view>
          
          <view class="form-actions">
            <button class="btn-cancel" @click="closeFeedback">取消</button>
            <button class="btn-submit" @click="submitFeedback">提交反馈</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showFeedbackModal: false,
      selectedFeedbackType: 'bug',
      feedbackContent: '',
      feedbackContact: '',
      feedbackTypes: [
        { value: 'bug', label: '问题反馈' },
        { value: 'suggestion', label: '功能建议' },
        { value: 'complaint', label: '投诉举报' },
        { value: 'other', label: '其他' }
      ],
      faqList: [
        {
          question: '如何设置健康目标？',
          answer: '在"目标管理"页面点击"添加目标"，选择目标类型（运动、饮食、心理健康），设置具体的目标值和完成时间，系统会为您制定个性化的计划。',
          expanded: false
        },
        {
          question: '数据统计不准确怎么办？',
          answer: '请检查是否正确记录了相关数据，如果数据已正确记录但仍不准确，可能是计算算法问题，请联系客服进行技术处理。',
          expanded: false
        },
        {
          question: '如何修改个人信息？',
          answer: '在"我的"页面点击头像区域，进入"个人信息"页面，可以修改昵称、性别、生日、身高、体重等基本信息。',
          expanded: false
        },
        {
          question: '忘记密码怎么办？',
          answer: '在登录页面点击"忘记密码"，通过邮箱或手机号验证身份后，可以重新设置密码。',
          expanded: false
        },
        {
          question: '如何导出健康数据？',
          answer: '在"数据统计"页面点击右上角的分享按钮，选择"导出数据"，可以将您的健康数据导出为PDF或Excel格式。',
          expanded: false
        },
        {
          question: '应用耗电量大怎么办？',
          answer: '建议关闭不必要的后台定位和通知，定期清理缓存，在设置中优化应用权限，这样可以有效减少电量消耗。',
          expanded: false
        }
      ],
      guideList: [
        {
          icon: '🎯',
          title: '目标设定',
          description: '根据个人情况设定合理的健康目标，循序渐进地改善生活习惯'
        },
        {
          icon: '📊',
          title: '数据记录',
          description: '坚持记录运动、饮食、睡眠等数据，帮助您更好地了解自己的健康状况'
        },
        {
          icon: '📈',
          title: '进度跟踪',
          description: '通过图表和统计了解目标完成情况，及时调整计划'
        },
        {
          icon: '🏆',
          title: '成就系统',
          description: '完成目标获得成就徽章，激励您持续保持健康生活方式'
        },
        {
          icon: '👥',
          title: '社区互动',
          description: '与其他用户分享经验，互相鼓励，共同进步'
        }
      ]
    }
  },
  methods: {
    showHelpDetail(type) {
      const routes = {
        usage: '/pages/guide/usage',
        faq: '/pages/guide/faq',
        contact: '/pages/guide/contact'
      }
      
      if (routes[type]) {
        uni.navigateTo({
          url: routes[type]
        })
      } else {
        uni.showToast({
          title: '功能开发中',
          icon: 'none'
        })
      }
    },
    toggleFaq(index) {
      this.faqList[index].expanded = !this.faqList[index].expanded
    },
    showFeedback() {
      this.showFeedbackModal = true
    },
    closeFeedback() {
      this.showFeedbackModal = false
      this.selectedFeedbackType = 'bug'
      this.feedbackContent = ''
      this.feedbackContact = ''
    },
    selectFeedbackType(type) {
      this.selectedFeedbackType = type
    },
    submitFeedback() {
      if (!this.feedbackContent.trim()) {
        uni.showToast({
          title: '请输入反馈内容',
          icon: 'none'
        })
        return
      }
      
      uni.showLoading({ title: '提交中...' })
      
      // 模拟提交反馈
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '反馈提交成功',
          icon: 'success'
        })
        this.closeFeedback()
      }, 1000)
    },
    copyEmail() {
      uni.setClipboardData({
        data: 'support@healthapp.com',
        success: () => {
          uni.showToast({
            title: '邮箱已复制',
            icon: 'success'
          })
        }
      })
    },
    copyWechat() {
      uni.setClipboardData({
        data: 'HealthApp_Service',
        success: () => {
          uni.showToast({
            title: '微信号已复制',
            icon: 'success'
          })
        }
      })
    },
    callService() {
      uni.makePhoneCall({
        phoneNumber: '400-123-4567',
        success: () => {
          console.log('拨打电话成功')
        },
        fail: () => {
          uni.showToast({
            title: '拨打电话失败',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.help-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 40rpx 40rpx;
  color: white;
}

.header-title {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 16rpx;
}

.header-subtitle {
  font-size: 28rpx;
  opacity: 0.9;
}

.content {
  padding: 40rpx;
  height: calc(100vh - 200rpx);
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.content::-webkit-scrollbar {
  display: none;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 32rpx;
}

/* 快速帮助 */
.quick-help {
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.help-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx 24rpx;
  background-color: #f8f9ff;
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.help-item:active {
  background-color: #e8eaff;
  transform: scale(0.98);
}

.help-icon {
  font-size: 48rpx;
  margin-bottom: 16rpx;
}

.help-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

/* 常见问题 */
.faq-section {
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.faq-item {
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 24rpx;
}

.faq-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
}

.faq-question {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  flex: 1;
  margin-right: 16rpx;
}

.faq-arrow {
  font-size: 32rpx;
  color: #999;
  transition: transform 0.3s ease;
}

.faq-arrow.expanded {
  transform: rotate(90deg);
}

.faq-answer {
  padding: 0 0 24rpx 0;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

/* 使用指南 */
.guide-section {
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.guide-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.guide-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.guide-icon {
  font-size: 48rpx;
  width: 80rpx;
  text-align: center;
}

.guide-content {
  flex: 1;
}

.guide-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.guide-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

/* 联系方式 */
.contact-section {
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  background-color: #f8f9ff;
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.contact-item:active {
  background-color: #e8eaff;
}

.contact-icon {
  font-size: 40rpx;
  width: 60rpx;
  text-align: center;
}

.contact-info {
  flex: 1;
}

.contact-label {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 4rpx;
}

.contact-value {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.contact-action {
  font-size: 26rpx;
  color: #667eea;
  font-weight: 500;
}

/* 应用信息 */
.app-info {
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #666;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

/* 反馈弹窗 */
.feedback-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 24rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 48rpx;
  color: #999;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:active {
  background-color: #f0f0f0;
}

.feedback-form {
  padding: 40rpx;
}

.form-group {
  margin-bottom: 32rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 16rpx;
}

.type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.type-item {
  padding: 16rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 50rpx;
  font-size: 26rpx;
  color: #666;
  transition: all 0.3s ease;
}

.type-item.active {
  background-color: #667eea;
  color: white;
}

.feedback-textarea {
  width: 100%;
  height: 200rpx;
  padding: 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 16rpx;
  font-size: 28rpx;
  line-height: 1.5;
  resize: none;
}

.feedback-input {
  width: 100%;
  height: 80rpx;
  padding: 0 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.form-actions {
  display: flex;
  gap: 24rpx;
  margin-top: 40rpx;
}

.btn-cancel, .btn-submit {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #666;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>
