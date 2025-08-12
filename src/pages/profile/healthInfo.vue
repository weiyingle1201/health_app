<template>
    <view class="health-page">
      <view class="header">
        <text class="header-title">健康信息</text>
        <text class="header-subtitle">完善您的健康档案，获得更精准的建议</text>
      </view>
  
      <view class="content">
        <!-- 活动水平 -->
        <view class="section">
          <view class="section-header">
            <text class="section-title">活动水平</text>
            <text class="section-desc">描述您日常的活动量</text>
          </view>
          <view class="option-list">
            <view 
              v-for="(option, index) in activityLevels" 
              :key="index"
              class="option-item"
              :class="{ active: healthInfo.activityLevel === option.value }"
              @click="selectActivityLevel(option.value)"
            >
              <view class="option-content">
                <text class="option-title">{{ option.label }}</text>
                <text class="option-desc">{{ option.description }}</text>
              </view>
              <view class="option-icon" v-if="healthInfo.activityLevel === option.value">✓</view>
            </view>
          </view>
        </view>
  
        <!-- 运动基础水平 -->
        <view class="section">
          <view class="section-header">
            <text class="section-title">运动基础水平</text>
            <text class="section-desc">评估您的运动经验和能力</text>
          </view>
          <view class="option-list">
            <view 
              v-for="(option, index) in fitnessLevels" 
              :key="index"
              class="option-item"
              :class="{ active: healthInfo.fitnessLevel === option.value }"
              @click="selectFitnessLevel(option.value)"
            >
              <view class="option-content">
                <text class="option-title">{{ option.label }}</text>
                <text class="option-desc">{{ option.description }}</text>
              </view>
              <view class="option-icon" v-if="healthInfo.fitnessLevel === option.value">✓</view>
            </view>
          </view>
        </view>
  
        <!-- 已知健康问题 -->
        <view class="section">
          <view class="section-header">
            <text class="section-title">已知健康问题</text>
            <text class="section-desc">选择您当前的健康状况（可多选）</text>
          </view>
          <view class="tag-list">
            <view 
              v-for="(problem, index) in healthProblems" 
              :key="index"
              class="tag-item"
              :class="{ active: healthInfo.healthProblems.includes(problem) }"
              @click="toggleHealthProblem(problem)"
            >
              <text>{{ problem }}</text>
            </view>
          </view>
          <view class="custom-input">
            <input 
              v-model="customHealthProblem" 
              placeholder="添加其他健康问题..." 
              @confirm="addCustomHealthProblem"
            />
            <button class="add-btn" @click="addCustomHealthProblem">添加</button>
          </view>
        </view>
  
        <!-- 饮食偏好/限制 -->
        <view class="section">
          <view class="section-header">
            <text class="section-title">饮食偏好/限制</text>
            <text class="section-desc">选择您的饮食偏好和限制（可多选）</text>
          </view>
          
          <!-- 饮食类型 -->
          <view class="diet-category">
            <text class="category-title">饮食类型</text>
            <view class="tag-list">
              <view 
                v-for="(diet, index) in dietTypes" 
                :key="index"
                class="tag-item"
                :class="{ active: healthInfo.dietPreferences.includes(diet) }"
                @click="toggleDietPreference(diet)"
              >
                <text>{{ diet }}</text>
              </view>
            </view>
          </view>
  
          <!-- 食物过敏 -->
          <view class="diet-category">
            <text class="category-title">食物过敏</text>
            <view class="tag-list">
              <view 
                v-for="(allergy, index) in foodAllergies" 
                :key="index"
                class="tag-item"
                :class="{ active: healthInfo.dietPreferences.includes(allergy) }"
                @click="toggleDietPreference(allergy)"
              >
                <text>{{ allergy }}</text>
              </view>
            </view>
          </view>
  
          <!-- 口味偏好 -->
          <view class="diet-category">
            <text class="category-title">口味偏好</text>
            <view class="tag-list">
              <view 
                v-for="(preference, index) in tastePreferences" 
                :key="index"
                class="tag-item"
                :class="{ active: healthInfo.dietPreferences.includes(preference) }"
                @click="toggleDietPreference(preference)"
              >
                <text>{{ preference }}</text>
              </view>
            </view>
          </view>
  
          <view class="custom-input">
            <input 
              v-model="customDietPreference" 
              placeholder="添加其他饮食偏好..." 
              @confirm="addCustomDietPreference"
            />
            <button class="add-btn" @click="addCustomDietPreference">添加</button>
          </view>
        </view>
  
        <!-- 睡眠质量自评 -->
        <view class="section">
          <view class="section-header">
            <text class="section-title">睡眠质量自评</text>
            <text class="section-desc">评估您最近的睡眠质量</text>
          </view>
          <view class="rating-container">
            <view class="rating-labels">
              <text>很差</text>
              <text>很好</text>
            </view>
            <view class="rating-stars">
              <view 
                v-for="i in 5" 
                :key="i"
                class="star"
                :class="{ active: i <= healthInfo.sleepQuality }"
                @click="setSleepQuality(i)"
              >
                ★
              </view>
            </view>
            <text class="rating-text">{{ sleepQualityText }}</text>
          </view>
        </view>
  
        <!-- 压力水平自评 -->
        <view class="section">
          <view class="section-header">
            <text class="section-title">压力水平自评</text>
            <text class="section-desc">评估您当前的压力水平</text>
          </view>
          <view class="rating-container">
            <view class="rating-labels">
              <text>很低</text>
              <text>很高</text>
            </view>
            <view class="rating-stars">
              <view 
                v-for="i in 5" 
                :key="i"
                class="star"
                :class="{ active: i <= healthInfo.stressLevel }"
                @click="setStressLevel(i)"
              >
                ★
              </view>
            </view>
            <text class="rating-text">{{ stressLevelText }}</text>
          </view>
        </view>
  
        <!-- 额外健康信息 -->
        <view class="section">
          <view class="section-header">
            <text class="section-title">额外健康信息</text>
            <text class="section-desc">其他您认为重要的健康信息</text>
          </view>
          <textarea 
            v-model="healthInfo.additionalInfo" 
            placeholder="例如：正在服用的药物、特殊身体状况、运动目标等..."
            class="additional-textarea"
          />
        </view>
      </view>
  
      <!-- 保存按钮 -->
      <view class="save-section">
        <button class="save-btn" @click="saveHealthInfo">保存健康信息</button>
      </view>
    </view>
  </template>
  
  <script>
  export default {
    data() {
      return {
        healthInfo: {
          activityLevel: '',
          fitnessLevel: '',
          healthProblems: [],
          dietPreferences: [],
          sleepQuality: 3,
          stressLevel: 3,
          additionalInfo: ''
        },
        customHealthProblem: '',
        customDietPreference: '',
        activityLevels: [
          {
            value: 'sedentary',
            label: '久坐不动',
            description: '几乎不运动，主要坐着工作'
          },
          {
            value: 'lightly_active',
            label: '轻度活动',
            description: '每周运动1-3次，轻度活动'
          },
          {
            value: 'moderately_active',
            label: '中度活动',
            description: '每周运动3-5次，中等强度'
          },
          {
            value: 'very_active',
            label: '高度活动',
            description: '每周运动6-7次，高强度'
          },
          {
            value: 'extra_active',
            label: '极高活动',
            description: '每天高强度运动或体力劳动'
          }
        ],
        fitnessLevels: [
          {
            value: 'beginner',
            label: '初学者',
            description: '刚开始运动，缺乏经验'
          },
          {
            value: 'intermediate',
            label: '中级',
            description: '有一定运动基础，能完成中等强度训练'
          },
          {
            value: 'advanced',
            label: '高级',
            description: '运动经验丰富，能完成高强度训练'
          }
        ],
        healthProblems: [
          '糖尿病', '高血压', '心脏病', '哮喘', '关节炎',
          '膝盖受伤', '腰背疼痛', '颈椎病', '失眠', '焦虑',
          '抑郁症', '胃病', '肝病', '肾病', '甲状腺疾病'
        ],
        dietTypes: [
          '素食', '纯素', '低碳水', '高蛋白', '地中海饮食',
          '生酮饮食', '间歇性断食', '无麸质', '无乳糖'
        ],
        foodAllergies: [
          '花生过敏', '坚果过敏', '海鲜过敏', '鸡蛋过敏',
          '牛奶过敏', '大豆过敏', '小麦过敏', '麸质过敏'
        ],
        tastePreferences: [
          '不吃辣', '不吃冰', '不吃甜', '不吃咸',
          '喜欢清淡', '喜欢重口味', '不吃油炸', '不吃腌制'
        ]
      }
    },
    computed: {
      sleepQualityText() {
        const texts = ['', '很差', '较差', '一般', '较好', '很好']
        return texts[this.healthInfo.sleepQuality] || '一般'
      },
      stressLevelText() {
        const texts = ['', '很低', '较低', '中等', '较高', '很高']
        return texts[this.healthInfo.stressLevel] || '中等'
      }
    },
    onLoad() {
      this.loadHealthInfo()
    },
    methods: {
      selectActivityLevel(level) {
        this.healthInfo.activityLevel = level
      },
      selectFitnessLevel(level) {
        this.healthInfo.fitnessLevel = level
      },
      toggleHealthProblem(problem) {
        const index = this.healthInfo.healthProblems.indexOf(problem)
        if (index > -1) {
          this.healthInfo.healthProblems.splice(index, 1)
        } else {
          this.healthInfo.healthProblems.push(problem)
        }
      },
      addCustomHealthProblem() {
        if (this.customHealthProblem.trim()) {
          this.healthInfo.healthProblems.push(this.customHealthProblem.trim())
          this.customHealthProblem = ''
        }
      },
      toggleDietPreference(preference) {
        const index = this.healthInfo.dietPreferences.indexOf(preference)
        if (index > -1) {
          this.healthInfo.dietPreferences.splice(index, 1)
        } else {
          this.healthInfo.dietPreferences.push(preference)
        }
      },
      addCustomDietPreference() {
        if (this.customDietPreference.trim()) {
          this.healthInfo.dietPreferences.push(this.customDietPreference.trim())
          this.customDietPreference = ''
        }
      },
      setSleepQuality(quality) {
        this.healthInfo.sleepQuality = quality
      },
      setStressLevel(level) {
        this.healthInfo.stressLevel = level
      },
      loadHealthInfo() {
        // 从本地存储加载健康信息
        const savedInfo = uni.getStorageSync('healthInfo')
        if (savedInfo) {
          this.healthInfo = { ...this.healthInfo, ...savedInfo }
        }
      },
      saveHealthInfo() {
        // 保存到本地存储
        uni.setStorageSync('healthInfo', this.healthInfo)
        
        uni.showLoading({ title: '保存中...' })
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({ 
            title: '保存成功', 
            icon: 'success' 
          })
          
          // 发送事件通知其他页面
          uni.$emit('healthInfoUpdated', this.healthInfo)
          
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        }, 500)
      }
    }
  }
  </script>
  
  <style scoped>
  .health-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 120rpx;
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
  }
  
  .section {
    background: white;
    border-radius: 24rpx;
    margin-bottom: 32rpx;
    padding: 40rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  }
  
  .section-header {
    margin-bottom: 32rpx;
  }
  
  .section-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .section-desc {
    font-size: 26rpx;
    color: #666;
  }
  
  .option-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }
  
  .option-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 16rpx;
    transition: all 0.3s ease;
  }
  
  .option-item.active {
    border-color: #667eea;
    background-color: #f8f9ff;
  }
  
  .option-content {
    flex: 1;
  }
  
  .option-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .option-desc {
    font-size: 24rpx;
    color: #666;
  }
  
  .option-icon {
    color: #667eea;
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    margin-bottom: 24rpx;
  }
  
  .tag-item {
    padding: 16rpx 24rpx;
    background-color: #f5f5f5;
    border-radius: 50rpx;
    font-size: 26rpx;
    color: #666;
    transition: all 0.3s ease;
  }
  
  .tag-item.active {
    background-color: #667eea;
    color: white;
  }
  
  .custom-input {
    display: flex;
    gap: 16rpx;
    align-items: center;
  }
  
  .custom-input input {
    flex: 1;
    height: 80rpx;
    padding: 0 24rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 16rpx;
    font-size: 28rpx;
  }
  
  .add-btn {
    height: 80rpx;
    padding: 0 32rpx;
    background-color: #667eea;
    color: white;
    border-radius: 16rpx;
    font-size: 28rpx;
    border: none;
  }
  
  .diet-category {
    margin-bottom: 32rpx;
  }
  
  .category-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    display: block;
    margin-bottom: 16rpx;
  }
  
  .rating-container {
    text-align: center;
  }
  
  .rating-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
  }
  
  .rating-labels text {
    font-size: 24rpx;
    color: #666;
  }
  
  .rating-stars {
    display: flex;
    justify-content: center;
    gap: 16rpx;
    margin-bottom: 16rpx;
  }
  
  .star {
    font-size: 48rpx;
    color: #e0e0e0;
    transition: all 0.3s ease;
  }
  
  .star.active {
    color: #ffd700;
  }
  
  .rating-text {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
  }
  
  .additional-textarea {
    width: 100%;
    height: 200rpx;
    padding: 24rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 16rpx;
    font-size: 28rpx;
    line-height: 1.5;
    resize: none;
  }
  
  .save-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24rpx 40rpx;
    background-color: white;
    box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);
  }
  
  .save-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;
  }
  </style>