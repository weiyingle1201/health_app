<template>
  <view class="diet-container">
    <!-- 营养摄入目标卡片 -->
    <view class="goal-card">
      <view class="goal-header">
        <text class="section-title">您的饮食目标</text>
        <button type="primary" size="mini" @click="goToAddDietGoal">+ 添加饮食目标</button>
      </view>
      
      <view v-if="!hasGoals && !goalsLoading" class="empty-goals">
        <view class="empty-description">您还没有设置饮食目标</view>
        <button type="primary" @click="goToAddDietGoal">立即设置</button>
      </view>
      
      <view v-else-if="goalsLoading" class="loading-container">
        <text>加载中...</text>
      </view>
      
      <view v-else class="goals-preview">
        <view class="goal-item" v-for="(goal, index) in dietGoals" :key="index">
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
        </view>
      </view>
    </view>

    <!-- 饮食记录表单 -->
    <view class="diet-form">
      <view class="form-header">
        <text class="section-title">饮食记录</text>
      </view>
      <form @submit.prevent="handleSubmit">
        <view class="form-item">
          <text class="form-label">餐食类型</text>
          <picker @change="onMealTypeChange" :value="mealTypeIndex" :range="mealTypes">
            <view class="picker">
              {{ mealTypes[mealTypeIndex] || '请选择餐食类型' }}
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label">食物类别</text>
          <checkbox-group @change="onFoodTypesChange">
            <label class="checkbox" v-for="(type, index) in foodCategories" :key="index">
              <checkbox :value="type.value" :checked="selectedFoodTypes.includes(type.value)" />
              <text>{{ type.label }}</text>
            </label>
          </checkbox-group>
        </view>
        
        <view class="form-item">
          <text class="form-label">卡路里估计 (卡)</text>
          <slider :min="0" :max="1500" :step="50" :value="dietForm.calories" @change="onCaloriesChange" show-value />
        </view>
        
        <view class="form-item">
          <text class="form-label">饮水量 (毫升)</text>
          <input type="number" v-model="dietForm.waterIntake" placeholder="例如: 250ml" />
        </view>
        
        <view class="form-item">
          <text class="form-label">备注</text>
          <textarea v-model="dietForm.notes" placeholder="记录一下饮食内容和感受" />
        </view>
        
        <view class="image-upload">
          <text class="form-label">添加餐食照片</text>
          <view class="upload-preview">
            <view class="upload-button" @click="chooseImage">
              <text class="iconfont">+</text>
            </view>
            <view class="image-preview" v-if="dietForm.imageUrl">
              <image :src="dietForm.imageUrl" mode="aspectFill"></image>
              <view class="delete-button" @click="deleteImage">×</view>
            </view>
          </view>
        </view>
        
        <button type="primary" :loading="loading" @click="handleSubmit" class="submit-btn">
          提交记录
        </button>
      </form>
    </view>

    <!-- 饮食历史记录 -->
    <view class="diet-history">
      <view class="history-header">
        <text class="section-title">饮食记录</text>
      </view>
      
      <view v-if="historyLoading" class="loading-container">
        <text>加载中...</text>
      </view>
      
      <view v-else-if="dietHistory.length === 0" class="empty-history">
        <text>暂无饮食记录</text>
      </view>
      
      <view v-else class="history-list">
        <view class="history-item" v-for="(item, index) in dietHistory" :key="index">
          <view class="history-type">
            {{ {
              breakfast: '早餐',
              lunch: '午餐',
              dinner: '晚餐',
              snack: '零食'
            }[item.data.mealType] }}
          </view>
          
          <view class="history-details">
            <text>食物类别: {{ formatFoodTypes(item.data.foodTypes) }}</text>
            <text>卡路里: {{ item.data.calories }} 卡</text>
            <text>时间: {{ formatDate(item.timestamp) }}</text>
          </view>
          
          <view class="history-image" v-if="item.data.imageUrl">
            <image :src="item.data.imageUrl" mode="aspectFill"></image>
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
      dietForm: {
        mealType: '',
        foodTypes: [],
        calories: 500,
        waterIntake: 0,
        notes: '',
        imageUrl: ''
      },
      mealTypeIndex: 0,
      mealTypes: ['早餐', '午餐', '晚餐', '零食'],
      mealTypeValues: ['breakfast', 'lunch', 'dinner', 'snack'],
      foodCategories: [
        { label: '蔬菜水果', value: 'vegetables' },
        { label: '主食', value: 'grains' },
        { label: '肉蛋', value: 'protein' },
        { label: '奶制品', value: 'dairy' },
        { label: '零食甜点', value: 'snacks' }
      ],
      selectedFoodTypes: [],
      dietHistory: [],
      loading: false,
      historyLoading: false,
      goalsLoading: false,
      dietGoals: []
    };
  },
  computed: {
    hasGoals() {
      return this.dietGoals.length > 0;
    }
  },
  methods: {
    // 表单操作
    onMealTypeChange(e) {
      this.mealTypeIndex = e.detail.value;
      this.dietForm.mealType = this.mealTypeValues[this.mealTypeIndex];
    },
    onFoodTypesChange(e) {
      this.selectedFoodTypes = e.detail.value;
      this.dietForm.foodTypes = this.selectedFoodTypes;
    },
    onCaloriesChange(e) {
      this.dietForm.calories = e.detail.value;
    },
    
    // 图片操作
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.dietForm.imageUrl = res.tempFilePaths[0];
        }
      });
    },
    deleteImage() {
      this.dietForm.imageUrl = '';
    },
    
    // 数据加载
    async loadDietGoals() {
      try {
        this.goalsLoading = true;
        const response = await getGoals();
        
        // 示例数据，实际应根据API返回的数据结构进行调整
        if (response && response.data && response.data.goals && response.data.goals.diet) {
          const goals = response.data.goals.diet;
          
          this.dietGoals = [
            {
              type: 'calories',
              title: '每日卡路里控制',
              description: '目标: 2000卡路里，今日已摄入1500卡路里',
              progress: 75
            },
            {
              type: 'water',
              title: '饮水量',
              description: '目标: 2000ml，已饮用1200ml',
              progress: 60
            },
            {
              type: 'vegetables',
              title: '蔬果摄入',
              description: '目标: 每日5份蔬果，已摄入3份',
              progress: 60
            }
          ];
        }
      } catch (error) {
        uni.showToast({
          title: '获取饮食目标失败',
          icon: 'none'
        });
        console.error(error);
      } finally {
        this.goalsLoading = false;
      }
    },
    
    async loadDietHistory() {
      try {
        this.historyLoading = true;
        const response = await getCheckins({
          type: 'diet',
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        });
        this.dietHistory = response.data.checkins || [];
      } catch (error) {
        uni.showToast({
          title: '获取饮食记录失败',
          icon: 'none'
        });
      } finally {
        this.historyLoading = false;
      }
    },
    
    // 提交记录
    async handleSubmit() {
      if (!this.dietForm.mealType) {
        uni.showToast({
          title: '请选择餐食类型',
          icon: 'none'
        });
        return;
      }
      
      if (this.selectedFoodTypes.length === 0) {
        uni.showToast({
          title: '请选择至少一种食物类别',
          icon: 'none'
        });
        return;
      }
      
      try {
        this.loading = true;
        await submitCheckin({
          type: 'diet',
          data: this.dietForm,
          timestamp: new Date().toISOString()
        });
        
        uni.showToast({
          title: '饮食记录提交成功',
          icon: 'success'
        });
        
        this.dietForm = {
          mealType: '',
          foodTypes: [],
          calories: 500,
          waterIntake: 0,
          notes: '',
          imageUrl: ''
        };
        this.selectedFoodTypes = [];
        this.mealTypeIndex = 0;
        
        this.loadDietHistory();
        this.loadDietGoals(); // 刷新目标完成情况
      } catch (error) {
        uni.showToast({
          title: '饮食记录提交失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    // 获取目标图标
    getGoalIcon(type) {
      const icons = {
        calories: '\ue606',
        water: '\ue635',
        vegetables: '\ue608'
      };
      return icons[type] || '\ue606';
    },
    
    // 格式化日期
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
    
    // 格式化食物类型
    formatFoodTypes(types) {
      if (!types || !Array.isArray(types) || types.length === 0) return '';
      
      const typeMap = {
        vegetables: '蔬菜水果',
        grains: '主食',
        protein: '肉蛋',
        dairy: '奶制品',
        snacks: '零食甜点'
      };
      
      return types.map(type => typeMap[type] || type).join(', ');
    },
    
    // 导航到添加目标页面
    goToAddDietGoal() {
      uni.navigateTo({
        url: 'pages/diet/add-diet-goal',
        fail: (err) => {
          console.error('导航失败:', err);
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    }
  },
  onLoad() {
    this.loadDietHistory();
    this.loadDietGoals();
  }
};
</script>

<style>
page {
  background-color: #f5f5f5;
}

.diet-container {
  padding: 20rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.goal-card, 
.diet-form,
.diet-history {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.goal-header, .form-header, .history-header {
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

.loading-container {
  padding: 40rpx 0;
  text-align: center;
  color: #666;
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

.checkbox {
  display: inline-flex;
  align-items: center;
  margin-right: 30rpx;
  margin-bottom: 16rpx;
}

.image-upload {
  margin-bottom: 30rpx;
}

.upload-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.upload-button {
  width: 160rpx;
  height: 160rpx;
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60rpx;
  color: #999;
}

.image-preview {
  width: 160rpx;
  height: 160rpx;
  position: relative;
}

.image-preview image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.delete-button {
  position: absolute;
  top: -16rpx;
  right: -16rpx;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
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

.history-image {
  margin-top: 16rpx;
  width: 100%;
  height: 200rpx;
}

.history-image image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
  object-fit: cover;
}
</style> 