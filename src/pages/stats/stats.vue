<template>
    <view class="dashboard-page">
      <!-- 顶部导航 -->
      <view class="header">
        <view class="header-content">
          <text class="header-title">数据统计</text>
          <view class="time-filter">
            <view 
              v-for="(period, index) in timePeriods" 
              :key="index"
              class="filter-item"
              :class="{ active: currentPeriod === period.value }"
              @click="switchPeriod(period.value)"
            >
              <text>{{ period.label }}</text>
            </view>
          </view>
        </view>
      </view>
  
      <!-- 主要内容区域 -->
      <scroll-view class="content" scroll-y="true" @scrolltolower="loadMoreData">
        <!-- 健康概览卡片 -->
        <view class="overview-card">
          <view class="overview-header">
            <text class="overview-title">健康概览</text>
            <text class="overview-subtitle">{{ getPeriodText() }}数据</text>
          </view>
          
          <view class="overview-stats">
            <view class="stat-item">
              <view class="stat-circle">
                <text class="stat-number">{{ healthScore }}</text>
                <text class="stat-unit">分</text>
              </view>
              <text class="stat-label">健康评分</text>
            </view>
            
            <view class="stat-item">
              <view class="stat-circle">
                <text class="stat-number">{{ goalCompletion }}%</text>
              </view>
              <text class="stat-label">目标完成率</text>
            </view>
            
            <view class="stat-item">
              <view class="stat-circle">
                <text class="stat-number">{{ streakDays }}</text>
              </view>
              <text class="stat-label">连续打卡</text>
            </view>
          </view>
        </view>
  
        <!-- 运动数据 -->
        <view class="data-card">
          <view class="card-header">
            <view class="card-title">
              <text class="title-icon">🏃‍♂️</text>
              <text class="title-text">运动数据</text>
            </view>
            <text class="card-more" @click="viewDetail('exercise')">查看详情 ›</text>
          </view>
          
          <view class="card-content">
            <view class="data-row">
              <view class="data-item">
                <text class="data-value">{{ exerciseData.totalTime }}</text>
                <text class="data-label">总运动时长(小时)</text>
              </view>
              <view class="data-item">
                <text class="data-value">{{ exerciseData.calories }}</text>
                <text class="data-label">消耗卡路里</text>
              </view>
              <view class="data-item">
                <text class="data-value">{{ exerciseData.sessions }}</text>
                <text class="data-label">运动次数</text>
              </view>
            </view>
            
            <view class="progress-section">
              <view class="progress-item">
                <view class="progress-header">
                  <text class="progress-label">本周目标完成度</text>
                  <text class="progress-percent">{{ exerciseData.goalProgress }}%</text>
                </view>
                <view class="progress-bar">
                  <view class="progress-fill" :style="{ width: exerciseData.goalProgress + '%' }"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
  
        <!-- 饮食数据 -->
        <view class="data-card">
          <view class="card-header">
            <view class="card-title">
              <text class="title-icon">🥗</text>
              <text class="title-text">饮食数据</text>
            </view>
            <text class="card-more" @click="viewDetail('diet')">查看详情 ›</text>
          </view>
          
          <view class="card-content">
            <view class="data-row">
              <view class="data-item">
                <text class="data-value">{{ dietData.avgCalories }}</text>
                <text class="data-label">日均卡路里</text>
              </view>
              <view class="data-item">
                <text class="data-value">{{ dietData.waterIntake }}</text>
                <text class="data-label">水分摄入(ml)</text>
              </view>
              <view class="data-item">
                <text class="data-value">{{ dietData.mealCount }}</text>
                <text class="data-label">记录餐数</text>
              </view>
            </view>
            
            <view class="nutrition-chart">
              <view class="chart-title">营养摄入比例</view>
              <view class="nutrition-bars">
                <view class="nutrition-item">
                  <text class="nutrition-label">蛋白质</text>
                  <view class="nutrition-bar">
                    <view class="nutrition-fill protein" :style="{ width: dietData.nutrition.protein + '%' }"></view>
                  </view>
                  <text class="nutrition-value">{{ dietData.nutrition.protein }}%</text>
                </view>
                <view class="nutrition-item">
                  <text class="nutrition-label">碳水</text>
                  <view class="nutrition-bar">
                    <view class="nutrition-fill carbs" :style="{ width: dietData.nutrition.carbs + '%' }"></view>
                  </view>
                  <text class="nutrition-value">{{ dietData.nutrition.carbs }}%</text>
                </view>
                <view class="nutrition-item">
                  <text class="nutrition-label">脂肪</text>
                  <view class="nutrition-bar">
                    <view class="nutrition-fill fat" :style="{ width: dietData.nutrition.fat + '%' }"></view>
                  </view>
                  <text class="nutrition-value">{{ dietData.nutrition.fat }}%</text>
                </view>
              </view>
            </view>
          </view>
        </view>
  
        <!-- 心理健康 -->
        <view class="data-card">
          <view class="card-header">
            <view class="card-title">
              <text class="title-icon">🧘‍♀️</text>
              <text class="title-text">心理健康</text>
            </view>
            <text class="card-more" @click="viewDetail('mental')">查看详情 ›</text>
          </view>
          
          <view class="card-content">
            <view class="mental-stats">
              <view class="mental-item">
                <view class="mental-icon">😴</view>
                <view class="mental-info">
                  <text class="mental-value">{{ mentalData.avgSleepQuality }}/5</text>
                  <text class="mental-label">平均睡眠质量</text>
                </view>
              </view>
              
              <view class="mental-item">
                <view class="mental-icon">😌</view>
                <view class="mental-info">
                  <text class="mental-value">{{ mentalData.avgStressLevel }}/5</text>
                  <text class="mental-label">平均压力水平</text>
                </view>
              </view>
              
              <view class="mental-item">
                <view class="mental-icon">🧘</view>
                <view class="mental-info">
                  <text class="mental-value">{{ mentalData.meditationTime }}分钟</text>
                  <text class="mental-label">冥想时长</text>
                </view>
              </view>
            </view>
            
            <view class="mood-trend">
              <text class="trend-title">本周情绪趋势</text>
              <view class="mood-chart">
                <view 
                  v-for="(mood, index) in mentalData.moodTrend" 
                  :key="index"
                  class="mood-bar"
                  :style="{ height: mood.value * 20 + 'rpx' }"
                >
                  <text class="mood-emoji">{{ mood.emoji }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
  
        <!-- 目标进度 -->
        <view class="data-card">
          <view class="card-header">
            <view class="card-title">
              <text class="title-icon">🎯</text>
              <text class="title-text">目标进度</text>
            </view>
            <text class="card-more" @click="viewDetail('goals')">查看详情 ›</text>
          </view>
          
          <view class="card-content">
            <view class="goals-list">
              <view 
                v-for="(goal, index) in goalsData" 
                :key="index"
                class="goal-item"
              >
                <view class="goal-info">
                  <text class="goal-name">{{ goal.name }}</text>
                  <text class="goal-progress">{{ goal.progress }}/{{ goal.target }}</text>
                </view>
                <view class="goal-bar">
                  <view 
                    class="goal-fill" 
                    :style="{ width: (goal.progress / goal.target * 100) + '%' }"
                  ></view>
                </view>
                <text class="goal-percent">{{ Math.round(goal.progress / goal.target * 100) }}%</text>
              </view>
            </view>
          </view>
        </view>
  
        <!-- 成就展示 -->
         <!--
        <view class="achievements-card">
          <view class="card-header">
            <view class="card-title">
              <text class="title-icon">🏆</text>
              <text class="title-text">最近成就</text>
            </view>
          </view>
          
          <view class="achievements-grid">
            <view 
              v-for="(achievement, index) in recentAchievements" 
              :key="index"
              class="achievement-item"
            >
              <view class="achievement-icon">{{ achievement.icon }}</view>
              <text class="achievement-name">{{ achievement.name }}</text>
              <text class="achievement-date">{{ achievement.date }}</text>
            </view>
          </view>
        </view> -->
      </scroll-view>
  
      <!-- 分享按钮 暂时不支持分享功能--> 
<!--      <view class="share-btn" @click="shareReport">
        <text class="share-icon">📤</text>
        <text class="share-text">导出报告</text>
      </view>-->
    </view>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentPeriod: 'week',
        timePeriods: [
          { value: 'week', label: '本周' },
          { value: 'month', label: '本月' },
          { value: 'year', label: '本年' }
        ],
        healthScore: 85,
        goalCompletion: 78,
        streakDays: 12,
        exerciseData: {
          totalTime: 8.5,
          calories: 2450,
          sessions: 6,
          goalProgress: 75
        },
        dietData: {
          avgCalories: 1850,
          waterIntake: 2100,
          mealCount: 21,
          nutrition: {
            protein: 25,
            carbs: 45,
            fat: 30
          }
        },
        mentalData: {
          avgSleepQuality: 4.2,
          avgStressLevel: 2.8,
          meditationTime: 120,
          moodTrend: [
            { day: '周一', value: 4, emoji: '😊' },
            { day: '周二', value: 3, emoji: '😐' },
            { day: '周三', value: 5, emoji: '😄' },
            { day: '周四', value: 4, emoji: '😊' },
            { day: '周五', value: 3, emoji: '😐' },
            { day: '周六', value: 5, emoji: '😄' },
            { day: '周日', value: 4, emoji: '😊' }
          ]
        },
        goalsData: [
          { name: '每周运动3次', progress: 2, target: 3 },
          { name: '每日喝水2000ml', progress: 6, target: 7 },
          { name: '睡眠质量4分以上', progress: 5, target: 7 },
          { name: '完成冥想目标', progress: 4, target: 5 }
        ],
        recentAchievements: [
          { icon: '🏃‍♂️', name: '运动达人', date: '2天前' },
          { icon: '💧', name: '水分充足', date: '3天前' },
          { icon: '😴', name: '优质睡眠', date: '5天前' },
          { icon: '🎯', name: '目标达成', date: '1周前' }
        ]
      }
    },
    onLoad() {
      this.loadDashboardData()
    },
    methods: {
      switchPeriod(period) {
        this.currentPeriod = period
        this.loadDashboardData()
      },
      getPeriodText() {
        const periodMap = {
          week: '本周',
          month: '本月',
          year: '本年'
        }
        return periodMap[this.currentPeriod] || '本周'
      },
      loadDashboardData() {
        // 根据选择的时间段加载数据
        uni.showLoading({ title: '加载中...' })
        
        // 模拟数据加载
        setTimeout(() => {
          // 这里可以根据 currentPeriod 加载不同的数据
          this.updateDataByPeriod()
          uni.hideLoading()
        }, 500)
      },
      updateDataByPeriod() {
        // 根据时间段更新数据
        const periodData = {
          week: {
            healthScore: 85,
            goalCompletion: 78,
            exerciseData: { totalTime: 8.5, calories: 2450, sessions: 6, goalProgress: 75 }
          },
          month: {
            healthScore: 82,
            goalCompletion: 85,
            exerciseData: { totalTime: 32.5, calories: 9800, sessions: 24, goalProgress: 88 }
          },
          year: {
            healthScore: 88,
            goalCompletion: 92,
            exerciseData: { totalTime: 380.5, calories: 115000, sessions: 280, goalProgress: 95 }
          }
        }
        
        const data = periodData[this.currentPeriod]
        if (data) {
          this.healthScore = data.healthScore
          this.goalCompletion = data.goalCompletion
          this.exerciseData = { ...this.exerciseData, ...data.exerciseData }
        }
      },
      loadMoreData() {
        // 加载更多数据（如果需要）
        console.log('加载更多数据')
      },
  
      //这里有问题，不应该跳转到目标设置界面，而应该是详细的数据记录
      viewDetail(type) {
        // 跳转到详细页面
        const routes = {
          exercise: '/pages/exercise/exercise',
          diet: '/pages/diet/diet',
          mental: '/pages/mental/mental',
          goals: '/pages/goals/goals'
        }
        
        if (routes[type]) {
          uni.navigateTo({
            url: routes[type]
          })
        }
      },
      shareReport() {
        uni.showActionSheet({
          itemList: ['分享到微信', '保存图片', '复制链接'],
          success: (res) => {
            const actions = ['微信分享', '保存图片', '复制链接']
            uni.showToast({
              title: `已${actions[res.tapIndex]}`,
              icon: 'success'
            })
          }
        })
      }
    }
  }
  </script>
  
  <style scoped>
  /* 全局样式重置 */
  * {
    box-sizing: border-box;
  }
  
  view, text, scroll-view {
    box-sizing: border-box;
  }
  .dashboard-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 120rpx;
    width: 100%;
    box-sizing: border-box;
  }
  
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 60rpx 40rpx 40rpx;
    color: white;
    width: 100%;
    box-sizing: border-box;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-title {
    font-size: 48rpx;
    font-weight: bold;
  }
  
  .time-filter {
    display: flex;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50rpx;
    padding: 8rpx;
  }
  
  .filter-item {
    padding: 12rpx 24rpx;
    border-radius: 50rpx;
    font-size: 26rpx;
    transition: all 0.3s ease;
  }
  
  .filter-item.active {
    background: white;
    color: #667eea;
    font-weight: 500;
  }
  
  .content {
    padding: 40rpx;
    height: calc(100vh - 200rpx);
    width: 100%;
    box-sizing: border-box;
  }
  
  .overview-card {
    background: white;
    border-radius: 24rpx;
    padding: 40rpx;
    margin-bottom: 32rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
    width: 100%;
    box-sizing: border-box;
  }
  
  .overview-header {
    margin-bottom: 32rpx;
  }
  
  .overview-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .overview-subtitle {
    font-size: 26rpx;
    color: #666;
  }
  
  .overview-stats {
    display: flex;
    justify-content: space-around;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-circle {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 16rpx;
    color: white;
  }
  
  .stat-number {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .stat-unit {
    font-size: 20rpx;
    opacity: 0.8;
  }
  
  .stat-label {
    font-size: 24rpx;
    color: #666;
  }
  
  .data-card {
    background: white;
    border-radius: 24rpx;
    padding: 40rpx;
    margin-bottom: 32rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
    width: 100%;
    box-sizing: border-box;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32rpx;
  }
  
  .card-title {
    display: flex;
    align-items: center;
  }
  
  .title-icon {
    font-size: 32rpx;
    margin-right: 16rpx;
  }
  
  .title-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  .card-more {
    font-size: 26rpx;
    color: #667eea;
  }
  
  .data-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32rpx;
    width: 100%;
  }
  
  .data-item {
    text-align: center;
    flex: 1;
  }
  
  .data-value {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .data-label {
    font-size: 24rpx;
    color: #666;
  }
  
  .progress-section {
    margin-top: 24rpx;
  }
  
  .progress-item {
    margin-bottom: 16rpx;
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12rpx;
  }
  
  .progress-label {
    font-size: 26rpx;
    color: #333;
  }
  
  .progress-percent {
    font-size: 26rpx;
    color: #667eea;
    font-weight: 500;
  }
  
  .progress-bar {
    height: 12rpx;
    background-color: #f0f0f0;
    border-radius: 6rpx;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 6rpx;
    transition: width 0.3s ease;
  }
  
  .nutrition-chart {
    margin-top: 24rpx;
  }
  
  .chart-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .nutrition-bars {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }
  
  .nutrition-item {
    display: flex;
    align-items: center;
    gap: 16rpx;
    width: 100%;
  }
  
  .nutrition-label {
    width: 80rpx;
    font-size: 24rpx;
    color: #666;
  }
  
  .nutrition-bar {
    flex: 1;
    height: 16rpx;
    background-color: #f0f0f0;
    border-radius: 8rpx;
    overflow: hidden;
  }
  
  .nutrition-fill {
    height: 100%;
    border-radius: 8rpx;
    transition: width 0.3s ease;
  }
  
  .nutrition-fill.protein {
    background-color: #ff6b6b;
  }
  
  .nutrition-fill.carbs {
    background-color: #4ecdc4;
  }
  
  .nutrition-fill.fat {
    background-color: #45b7d1;
  }
  
  .nutrition-value {
    width: 60rpx;
    font-size: 24rpx;
    color: #333;
    text-align: right;
  }
  
  .mental-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32rpx;
  }
  
  .mental-item {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }
  
  .mental-icon {
    font-size: 40rpx;
  }
  
  .mental-info {
    display: flex;
    flex-direction: column;
  }
  
  .mental-value {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
  }
  
  .mental-label {
    font-size: 22rpx;
    color: #666;
  }
  
  .mood-trend {
    margin-top: 24rpx;
  }
  
  .trend-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .mood-chart {
    display: flex;
    justify-content: space-between;
    align-items: end;
    height: 120rpx;
  }
  
  .mood-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    min-width: 60rpx;
  }
  
  .mood-emoji {
    font-size: 24rpx;
  }
  
  .goals-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
  }
  
  .goal-item {
    display: flex;
    align-items: center;
    gap: 16rpx;
    width: 100%;
  }
  
  .goal-info {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .goal-name {
    font-size: 28rpx;
    color: #333;
  }
  
  .goal-progress {
    font-size: 24rpx;
    color: #666;
  }
  
  .goal-bar {
    width: 200rpx;
    height: 12rpx;
    background-color: #f0f0f0;
    border-radius: 6rpx;
    overflow: hidden;
  }
  
  .goal-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 6rpx;
    transition: width 0.3s ease;
  }
  
  .goal-percent {
    width: 60rpx;
    font-size: 24rpx;
    color: #667eea;
    font-weight: 500;
    text-align: right;
  }
  
  .achievements-card {
    background: white;
    border-radius: 24rpx;
    padding: 40rpx;
    margin-bottom: 32rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
    width: 100%;
    box-sizing: border-box;
  }
  
  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24rpx;
  }
  
  .achievement-item {
    text-align: center;
    padding: 24rpx;
    background-color: #f8f9ff;
    border-radius: 16rpx;
  }
  
  .achievement-icon {
    font-size: 48rpx;
    margin-bottom: 12rpx;
  }
  
  .achievement-name {
    font-size: 26rpx;
    color: #333;
    font-weight: 500;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .achievement-date {
    font-size: 22rpx;
    color: #666;
  }
  
  .share-btn {
    position: fixed;
    bottom: 40rpx;
    right: 40rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20rpx 32rpx;
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    gap: 12rpx;
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
    z-index: 1000;
  }
  
  .share-icon {
    font-size: 28rpx;
  }
  
  .share-text {
    font-size: 28rpx;
    font-weight: 500;
  }
  </style>
  