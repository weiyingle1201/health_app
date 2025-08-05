<template>
  <view class="exercise-container">
    <!-- Custom Navigation Bar -->
    <view class="custom-nav-bar">
      <view class="back-button" @click="goBack">
        <text class="back-icon">&lt;</text>
      </view>
      <text class="page-title-text">运动打卡</text>
    </view>

    <!-- 添加运动目标按钮 -->
    <view class="add-goal-button-container">
      <button type="primary" @click="goToAddGoal" class="add-goal-btn">+ 添加运动目标</button>
    </view>

    <!-- 当前运动目标卡片 -->
    <view class="goal-card">
      <view class="goal-header">
        <text class="section-title">您的运动目标</text>
      </view>
      
      <view v-if="!hasGoals && !goalsLoading" class="empty-goals">
        <view class="empty-description">您还没有设置运动目标</view>
        <button type="primary" @click="goToAddGoal">立即设置</button>
      </view>
      
      <view v-else-if="goalsLoading" class="loading-container">
        <text>加载中...</text>
      </view>
      
      <view v-else class="goals-preview">
        <view class="goal-item" v-for="(goal, index) in exerciseGoals" :key="index">
          <view class="goal-icon">
            <text class="iconfont">{{ getGoalIcon(goal.type) }}</text>
          </view>
          <view class="goal-content">
            <text class="goal-title">{{ goal.title }}</text>
            <view class="goal-progress">
              <progress :percent="goal.progress" show-info stroke-width="3" />
            </view>
            <text class="goal-description">{{ goal.description }}</text>
          </view>
          <view class="goal-actions">
            <button v-if="goal.recordable" size="mini" @click="recordActivity(goal)">
              记录活动
            </button>
            <button v-if="goal.type === 'steps'" size="mini" @click="recordActivity(goal)" :disabled="goal.completed">
              {{ goal.completed ? '已完成' : '完成' }}
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 运动打卡表单 -->
    <view class="exercise-form">
      <view class="form-header">
        <text class="section-title">运动打卡</text>
      </view>
      <form @submit.prevent="handleSubmit">
        <view class="form-item">
          <text class="form-label">运动类型</text>
          <picker @change="onExerciseTypeChange" :value="exerciseTypeIndex" :range="exerciseTypes">
            <view class="picker">
              {{ exerciseTypes[exerciseTypeIndex] || '请选择运动类型' }}
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label">运动时长(分钟)</text>
          <slider :min="0" :max="180" :step="5" :value="exerciseForm.duration" @change="onDurationChange" show-value />
        </view>
        
        <view class="form-item">
          <text class="form-label">运动强度</text>
          <radio-group @change="onIntensityChange">
            <label class="radio">
              <radio value="low" :checked="exerciseForm.intensity === 'low'" />
              <text>低强度</text>
            </label>
            <label class="radio">
              <radio value="medium" :checked="exerciseForm.intensity === 'medium'" />
              <text>中等强度</text>
            </label>
            <label class="radio">
              <radio value="high" :checked="exerciseForm.intensity === 'high'" />
              <text>高强度</text>
            </label>
          </radio-group>
        </view>
        
        <view class="form-item">
          <text class="form-label">消耗卡路里</text>
          <input type="number" v-model="exerciseForm.calories" placeholder="输入消耗的卡路里" />
        </view>
        
        <view class="form-item">
          <text class="form-label">备注</text>
          <textarea v-model="exerciseForm.notes" placeholder="记录一下运动感受吧" />
        </view>
        
        <button type="primary" :loading="loading" @click="handleSubmit" class="submit-btn">
          提交打卡
        </button>
      </form>
    </view>

    <!-- 运动历史记录 -->
    <view class="exercise-history">
      <view class="history-header">
        <text class="section-title">运动记录</text>
      </view>
      
      <view v-if="historyLoading" class="loading-container">
        <text>加载中...</text>
      </view>
      
      <view v-else-if="exerciseHistory.length === 0" class="empty-history">
        <text>暂无运动记录</text>
      </view>
      
      <view v-else class="history-list">
        <view class="history-item" v-for="(item, index) in exerciseHistory" :key="index">
          <view class="history-type">
            {{ {
              running: '跑步',
              walking: '步行',
              cycling: '骑行',
              swimming: '游泳',
              workout: '健身'
            }[item.data.exerciseType] }}
          </view>
          
          <view class="history-details">
            <text>时长: {{ item.data.duration }}分钟</text>
            <text>强度: {{ {
              low: '低强度',
              medium: '中等强度',
              high: '高强度'
            }[item.data.intensity] }}</text>
            <text>卡路里: {{ item.data.calories }}</text>
            <text>时间: {{ formatDate(item.timestamp) }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { submitCheckin, getCheckins } from '@/api/checkins';
import { getGoals } from '@/api/goals';

export default {
  data() {
    return {
      exerciseForm: {
        exerciseType: '',
        duration: 30,
        intensity: 'medium',
        calories: 0,
        notes: ''
      },
      exerciseTypeIndex: 0,
      exerciseTypes: ['跑步', '步行', '骑行', '游泳', '健身'],
      exerciseTypeValues: ['running', 'walking', 'cycling', 'swimming', 'workout'],
      exerciseHistory: [],
      loading: false,
      historyLoading: false,
      goalsLoading: false,
      exerciseGoals: []
    };
  },
  computed: {
    hasGoals() {
      return this.exerciseGoals.length > 0;
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    // 表单操作
    onExerciseTypeChange(e) {
      this.exerciseTypeIndex = e.detail.value;
      this.exerciseForm.exerciseType = this.exerciseTypeValues[this.exerciseTypeIndex];
    },
    onDurationChange(e) {
      this.exerciseForm.duration = e.detail.value;
    },
    onIntensityChange(e) {
      this.exerciseForm.intensity = e.detail.value;
    },
    
    // 数据加载
    async loadExerciseGoals() {
      try {
        this.goalsLoading = true;
        const response = await getGoals();
        
        // 假设API返回的数据需要转换成我们需要的格式
        if (response && response.data && response.data.goals && response.data.goals.exercise) {
          const goals = response.data.goals.exercise;
          
          // 示例数据，实际应根据API返回的数据结构进行调整
          this.exerciseGoals = [
            {
              type: 'steps',
              title: '每日步数目标',
              description: '今日目标: 10,000步，已完成7,500步',
              progress: 75,
              completed: false,
              recordable: false
            },
            {
              type: 'strength',
              title: '力量训练',
              description: '本周目标: 3次，已完成2次',
              progress: 66,
              completed: false,
              recordable: true
            },
            {
              type: 'swimming',
              title: '游泳',
              description: '本周目标: 2次，每次30分钟，已完成1次',
              progress: 50,
              completed: false,
              recordable: true
            }
          ];
        }
      } catch (error) {
        uni.showToast({
          title: '获取运动目标失败',
          icon: 'none'
        });
        console.error(error);
      } finally {
        this.goalsLoading = false;
      }
    },
    
    async loadExerciseHistory() {
      try {
        this.historyLoading = true;
        const response = await getCheckins({
          type: 'exercise',
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        });
        this.exerciseHistory = response.data.checkins || [];
      } catch (error) {
        uni.showToast({
          title: '获取运动记录失败',
          icon: 'none'
        });
      } finally {
        this.historyLoading = false;
      }
    },
    
    // 提交打卡
    async handleSubmit() {
      this.loading = true;
      try {
        const checkinData = {
          type: 'exercise',
          data: { ...this.exerciseForm },
          timestamp: new Date().toISOString()
        };
        
        // 确保选择了运动类型
        if (!this.exerciseForm.exerciseType) {
            uni.showToast({
                title: '请选择运动类型',
                icon: 'none'
            });
            this.loading = false;
            return; // 提前返回，不执行后续操作，也不返回上一页
        }

        await submitCheckin(checkinData);
        uni.showToast({
          title: '打卡成功',
          icon: 'success'
        });
        // 成功后可以重新加载历史记录
        this.loadExerciseHistory(); 
        // 清空表单或重置
        this.resetForm();

      } catch (error) {
        uni.showToast({
          title: error.message || '打卡失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
        // 无论成功或失败，都尝试返回上一页
        uni.navigateBack();
      }
    },

    resetForm() {
      this.exerciseForm = {
        exerciseType: '',
        duration: 30,
        intensity: 'medium',
        calories: 0,
        notes: ''
      };
      this.exerciseTypeIndex = 0; // 重置picker的显示
    },
    
    // 导航到添加目标页面
    goToAddGoal() {
      uni.navigateTo({
        url: '/pages/exercise/add-goal'
      });
    },
    
    // 根据目标记录活动
    recordActivity(goal) {
      // 根据目标类型预填充表单
      const typeMap = {
        swimming: 3,
        strength: 4,
        steps: 1
      };
      
      this.exerciseTypeIndex = typeMap[goal.type] || 0;
      this.exerciseForm.exerciseType = this.exerciseTypeValues[this.exerciseTypeIndex];
      
      // 滚动到打卡表单
      uni.pageScrollTo({
        scrollTop: 300,
        duration: 300
      });
    },
    
    // 获取目标图标
    getGoalIcon(type) {
      const icons = {
        steps: '\ue892', // 使用uni-app内置图标
        strength: '\ue65e',
        swimming: '\ue604'
      };
      return icons[type] || '\ue63a';
    },
    
    // 格式化日期
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    }
  },
  onLoad() {
    this.loadExerciseHistory();
    this.loadExerciseGoals();
  }
};
</script>

<style>
page {
  background-color: #f5f5f5;
}

.exercise-container {
  padding: 20rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.goal-card, 
.exercise-form,
.exercise-history {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.empty-goals, .empty-history {
  padding: 40rpx 0;
  text-align: center;
}

.empty-description {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.goals-preview {
  display: flex;
  flex-direction: column;
}

.goal-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-radius: 16rpx;
  background-color: #f9f9f9;
  margin-bottom: 20rpx;
}

.goal-icon {
  font-size: 60rpx;
  color: #6654e0;
  margin-right: 20rpx;
}

.goal-content {
  flex: 1;
}

.goal-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.goal-progress {
  margin: 16rpx 0;
}

.goal-description {
  font-size: 26rpx;
  color: #666;
}

.goal-actions {
  margin-left: 20rpx;
}

.loading-container {
  padding: 40rpx 0;
  text-align: center;
  color: #666;
}

.form-header, .history-header {
  margin-bottom: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.picker {
  height: 80rpx;
  line-height: 80rpx;
  border: 2rpx solid #eee;
  border-radius: 8rpx;
  padding: 0 20rpx;
  background-color: #f9f9f9;
}

.radio {
  margin-right: 30rpx;
}

.submit-btn {
  margin-top: 40rpx;
  background-color: #6654e0;
}

.history-list {
  display: flex;
  flex-direction: column;
}

.history-item {
  padding: 20rpx;
  border-radius: 16rpx;
  background-color: #f9f9f9;
  margin-bottom: 20rpx;
}

.history-type {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
  color: #6654e0;
}

.history-details {
  display: flex;
  flex-direction: column;
}

.history-details text {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 6rpx;
}

.custom-nav-bar {
  display: flex;
  align-items: center;
  padding: 15rpx 0; /* 上下留一点间距，左右因为父容器已有padding，这里设0 */
  margin-bottom: 20rpx; /* 与下方内容的间距 */
  position: relative; /* 用于可能的绝对定位元素，如此处不需要 */
  width: 100%; /* 确保撑满exercise-container的宽度 */
}

.back-button {
  padding: 10rpx 20rpx 10rpx 10rpx; /* 增大点击区域，左侧留空少一些因为图标本身靠左 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 40rpx; /* 返回图标大小 */
  font-weight: bold;
  color: #333; /* 返回图标颜色 */
}

.page-title-text {
  font-size: 36rpx; /* 与 section-title 保持一致 */
  font-weight: bold;
  color: #333;
  position: absolute; /* 使用绝对定位使其居中 */
  left: 50%;
  transform: translateX(-50%);
}

/* 新增按钮容器样式 */
.add-goal-button-container {
  margin-bottom: 30rpx; /* 与下方卡片的间距 */
  display: flex;
  justify-content: center;
}

.add-goal-btn {
  width: 100%; /* 按钮宽度设为100% */
  background-color: #6654e0; /* 与提交按钮颜色一致 */
  color: white;
  padding: 20rpx 0; /* 增加按钮的垂直内边距 */
  font-size: 32rpx; /* 调整字体大小 */
  border-radius: 50rpx; /* 更圆润的边角 */
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
}
/* --- */
</style> 