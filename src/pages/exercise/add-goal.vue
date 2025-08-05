<template>
  <view class="add-goal-container">
    <!-- 大目标选择区 -->
    <view class="section goal-section">
      <text class="section-title">选择您的主要运动目标</text>
      <view class="goal-cards">
        <view 
          v-for="(goal, index) in mainGoals" 
          :key="index"
          :class="['goal-card', { 'active': selectedMainGoal === goal.value }]"
          @click="selectedMainGoal = goal.value"
        >
          <view class="goal-icon">
            <text class="iconfont">{{ goal.icon }}</text>
          </view>
          <view class="goal-info">
            <text class="goal-title">{{ goal.label }}</text>
            <text class="goal-desc">{{ goal.description }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 运动偏好设置 -->
    <view class="section preference-section">
      <text class="section-title">您的运动偏好</text>
      
      <view class="preference-item">
        <text class="item-title">运动类型 <text class="hint">(最多选3个)</text></text>
        <view class="exercise-types">
          <checkbox-group @change="onExerciseTypesChange">
            <label 
              class="checkbox-item" 
              v-for="type in filteredExerciseTypes" 
              :key="type.value"
            >
              <checkbox :value="type.value" :checked="selectedExerciseTypes.includes(type.value)" />
              <text>{{ type.label }}</text>
            </label>
          </checkbox-group>
        </view>
      </view>
      
      <view class="preference-item">
        <text class="item-title">每周可用时间: {{ weeklyHours }}小时</text>
        <slider 
          :value="weeklyHours"
          :min="3"
          :max="10"
          :step="0.5"
          show-value
          @change="onWeeklyHoursChange"
        />
      </view>
      
      <view class="preference-item">
        <text class="item-title">是否有运动设备？</text>
        <switch :checked="hasEquipment" @change="onEquipmentChange" />
      </view>
    </view>

    <!-- 智能拆解设置 -->
    <view class="section ai-section">
      <view class="section-header">
        <view class="ai-icon"><text class="iconfont">\ue6a4</text></view>
        <text class="section-title">AI智能拆解您的目标</text>
      </view>
      
      <view class="intensity-options">
        <view 
          v-for="intensity in intensityOptions" 
          :key="intensity.value"
          :class="['intensity-card', { 'active': selectedIntensity === intensity.value }]"
          @click="selectedIntensity = intensity.value"
        >
          <text class="intensity-title">{{ intensity.label }}</text>
          <text class="intensity-desc">{{ intensity.description }}</text>
        </view>
      </view>
      
      <text class="ai-hint">AI将根据您的选择拆解为每日/每周可执行的小目标</text>
      <view class="hint-button" @click="showAiPrinciple">
        <text class="iconfont">\ue63d</text>
      </view>
    </view>

    <!-- 预览区 -->
    <view class="section preview-section">
      <text class="section-title">您的目标预览</text>
      
      <view class="preview-content">
        <view class="preview-list">
          <view class="preview-item" v-for="(item, index) in goalPreview" :key="index">
            <text>{{ item }}</text>
          </view>
        </view>
        
        <view v-if="goalDetails.length > 0" class="details-panel">
          <view class="details-header" @click="toggleDetails">
            <text>查看详细拆解</text>
            <text class="arrow" :class="{ 'arrow-down': showDetails }">{{ showDetails ? '∧' : '∨' }}</text>
          </view>
          <view class="details-content" v-if="showDetails">
            <view class="details-list">
              <view class="details-item" v-for="(detail, index) in goalDetails" :key="index">
                <text>{{ detail }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="action-buttons">
      <button @click="goBack" size="default" type="default">取消</button>
      <button @click="saveGoal" size="default" type="primary" :loading="loading">保存目标</button>
    </view>
  </view>
</template>

<script>
import { setGoals } from '@/api/goals';

export default {
  data() {
    return {
      // 主要目标选项
      mainGoals: [
        { 
          label: '减脂塑形', 
          value: 'fat-loss', 
          icon: '\ue735', 
          description: '通过有氧运动减少脂肪' 
        },
        { 
          label: '增肌力量', 
          value: 'muscle-gain', 
          icon: '\ue652', 
          description: '通过力量训练增加肌肉量' 
        },
        { 
          label: '提升耐力', 
          value: 'endurance', 
          icon: '\ue60f', 
          description: '提高心肺功能和运动持久力' 
        },
        { 
          label: '柔韧平衡', 
          value: 'flexibility', 
          icon: '\ue622', 
          description: '增加身体柔韧性和平衡能力' 
        }
      ],
      
      // 所有运动类型
      allExerciseTypes: [
        { label: '跑步', value: 'running', goals: ['fat-loss', 'endurance'] },
        { label: '游泳', value: 'swimming', goals: ['fat-loss', 'endurance', 'flexibility'] },
        { label: '骑行', value: 'cycling', goals: ['fat-loss', 'endurance'] },
        { label: '健身操', value: 'aerobics', goals: ['fat-loss', 'flexibility'] },
        { label: '瑜伽', value: 'yoga', goals: ['flexibility', 'endurance'] },
        { label: '力量训练', value: 'weight-training', goals: ['muscle-gain'] },
        { label: '高强度间歇训练', value: 'hiit', goals: ['fat-loss', 'endurance', 'muscle-gain'] },
        { label: '普拉提', value: 'pilates', goals: ['flexibility', 'endurance'] },
        { label: '拉伸', value: 'stretching', goals: ['flexibility'] },
        { label: '团体运动', value: 'team-sports', goals: ['endurance', 'fat-loss'] }
      ],
      
      // 强度选项
      intensityOptions: [
        { 
          label: '温和', 
          value: 'mild', 
          description: '适合初学者，变化缓慢' 
        },
        { 
          label: '平衡', 
          value: 'balanced', 
          description: '推荐选项，循序渐进' 
        },
        { 
          label: '激进', 
          value: 'aggressive', 
          description: '快速见效，挑战性强' 
        }
      ],
      
      // 表单状态
      selectedMainGoal: 'fat-loss',
      selectedExerciseTypes: [],
      weeklyHours: 5,
      hasEquipment: false,
      selectedIntensity: 'balanced',
      
      // 界面状态
      loading: false,
      showDetails: false
    };
  },
  computed: {
    // 根据选择的主目标过滤运动类型
    filteredExerciseTypes() {
      return this.allExerciseTypes.filter(type => 
        type.goals.includes(this.selectedMainGoal)
      );
    },
    
    // 预览目标
    goalPreview() {
      if (!this.selectedMainGoal || this.selectedExerciseTypes.length === 0) {
        return ['请选择运动目标和类型以查看预览'];
      }

      const preview = [];
      const types = this.selectedExerciseTypes.map(value => {
        const type = this.allExerciseTypes.find(t => t.value === value);
        return type ? type.label : value;
      });

      // 根据不同目标和强度生成不同预览
      if (this.selectedMainGoal === 'fat-loss') {
        const frequency = this.selectedIntensity === 'mild' ? 2 : 
                         this.selectedIntensity === 'balanced' ? 3 : 4;
        const duration = this.selectedIntensity === 'mild' ? '20-30' : 
                        this.selectedIntensity === 'balanced' ? '30-40' : '40-50';
        
        preview.push(`每周${frequency}次${types[0] || '有氧运动'}，每次${duration}分钟`);
        preview.push('每天记录饮食和运动情况');
        
        if (this.selectedIntensity !== 'mild') {
          preview.push('心率维持在120-150区间');
        }
      } 
      else if (this.selectedMainGoal === 'muscle-gain') {
        const frequency = this.selectedIntensity === 'mild' ? 2 : 
                         this.selectedIntensity === 'balanced' ? 3 : 4;
        
        preview.push(`每周${frequency}次力量训练，分别锻炼不同肌群`);
        if (this.hasEquipment) {
          preview.push('利用哑铃进行递增式负重训练');
        } else {
          preview.push('利用自身体重进行递增式训练');
        }
      }
      else if (this.selectedMainGoal === 'endurance') {
        const increment = this.selectedIntensity === 'mild' ? '5%' : 
                         this.selectedIntensity === 'balanced' ? '10%' : '15%';
        
        preview.push(`每周进行${Math.ceil(this.weeklyHours/2)}次${types[0] || '耐力训练'}`);
        preview.push(`每周增加训练时间${increment}`);
      }
      else if (this.selectedMainGoal === 'flexibility') {
        const frequency = this.selectedIntensity === 'mild' ? 2 : 
                         this.selectedIntensity === 'balanced' ? 4 : 6;
        
        preview.push(`每周${frequency}次柔韧性训练，每次15-20分钟`);
        preview.push('每天进行5分钟全身拉伸');
      }

      return preview;
    },
    
    // 详细目标拆解
    goalDetails() {
      if (!this.selectedMainGoal || this.selectedExerciseTypes.length === 0) {
        return [];
      }

      const details = [];
      
      if (this.selectedMainGoal === 'fat-loss') {
        details.push('周一、周三、周五：有氧训练，保持心率在目标区间');
        details.push('周二、周六：力量训练，增加代谢率');
        details.push('每日记录体重和身体围度变化');
        details.push('控制每日热量摄入，确保适度热量赤字');
      } 
      else if (this.selectedMainGoal === 'muscle-gain') {
        details.push('周一：上肢力量训练（胸、肩、三头肌）');
        details.push('周三：下肢力量训练（大腿、臀部、小腿）');
        details.push('周五：背部和手臂训练（背阔肌、二头肌）');
        details.push('每组8-12次，3-4组，训练至肌肉疲劳');
        details.push('确保每日摄入足够蛋白质（体重×1.6-2.0g）');
      }
      else if (this.selectedMainGoal === 'endurance') {
        details.push('第1-2周：建立基础耐力，低强度长时间训练');
        details.push('第3-4周：加入中等强度间歇训练，提高有氧能力');
        details.push('第5-6周：增加高强度间歇训练比例，突破平台期');
        details.push('每周安排1-2天完全休息，促进恢复');
      }
      else if (this.selectedMainGoal === 'flexibility') {
        details.push('晨起5分钟全身唤醒拉伸');
        details.push('周二、周四：15-20分钟全面柔韧性训练');
        details.push('周六：30分钟深度柔韧和平衡训练');
        details.push('每次训练后5分钟冷静放松');
        details.push('每个姿势保持20-30秒，感受拉伸不要用力过猛');
      }

      return details;
    }
  },
  watch: {
    // 当主目标改变时，重置选择的运动类型
    selectedMainGoal() {
      this.selectedExerciseTypes = [];
    }
  },
  methods: {
    // 表单事件处理
    onExerciseTypesChange(e) {
      this.selectedExerciseTypes = e.detail.value;
      // 限制最多选择3个
      if (this.selectedExerciseTypes.length > 3) {
        this.selectedExerciseTypes = this.selectedExerciseTypes.slice(0, 3);
      }
    },
    
    onWeeklyHoursChange(e) {
      this.weeklyHours = e.detail.value;
    },
    
    onEquipmentChange(e) {
      this.hasEquipment = e.detail.value;
    },
    
    // 显示AI原理说明
    showAiPrinciple() {
      uni.showModal({
        title: 'AI拆解原理',
        content: 'AI系统基于运动科学、用户个人情况和目标，将长期目标拆解为渐进式的短期任务，通过每周调整和反馈优化，实现可持续的健康习惯养成。',
        showCancel: false
      });
    },
    
    // 切换详情显示状态
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 保存目标
    async saveGoal() {
      if (this.selectedExerciseTypes.length === 0) {
        uni.showToast({
          title: '请至少选择一种运动类型',
          icon: 'none'
        });
        return;
      }

      try {
        this.loading = true;
        
        // 构造提交的数据
        const goalData = {
          selectedGoals: ['exercise'],
          exerciseGoals: {
            mainGoal: this.selectedMainGoal,
            exerciseTypes: this.selectedExerciseTypes,
            weeklyHours: this.weeklyHours,
            hasEquipment: this.hasEquipment,
            intensity: this.selectedIntensity,
            daysPerWeek: Math.min(Math.ceil(this.weeklyHours / 2), 7)
          }
        };
        
        await setGoals(goalData);
        
        uni.showToast({
          title: '运动目标设置成功',
          icon: 'success'
        });
        
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } catch (error) {
        uni.showToast({
          title: '保存目标失败，请重试',
          icon: 'none'
        });
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
page {
  background-color: #f5f5f5;
}

.add-goal-container {
  padding: 20rpx;
}

.section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

/* 目标卡片样式 */
.goal-cards {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.goal-card {
  border: 2rpx solid #eee;
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.goal-card.active {
  border-color: #6654e0;
  transform: scale(1.05);
  box-shadow: 0 4rpx 12rpx rgba(102, 84, 224, 0.2);
}

.goal-icon {
  font-size: 60rpx;
  margin-right: 20rpx;
  color: #6654e0;
}

.goal-info {
  flex: 1;
}

.goal-title {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 6rpx;
}

.goal-desc {
  font-size: 26rpx;
  color: #666;
}

/* 偏好设置样式 */
.preference-item {
  margin-bottom: 40rpx;
}

.item-title {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.hint {
  font-size: 26rpx;
  color: #999;
  font-weight: normal;
}

.exercise-types {
  display: flex;
  flex-wrap: wrap;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-right: 30rpx;
  margin-bottom: 20rpx;
}

/* AI部分样式 */
.ai-icon {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background: linear-gradient(45deg, #6654e0, #30cbd6);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16rpx;
}

.intensity-options {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.intensity-card {
  border: 2rpx solid #eee;
  border-radius: 16rpx;
  padding: 20rpx;
  transition: all 0.3s;
}

.intensity-card.active {
  border-color: #6654e0;
  background-color: rgba(102, 84, 224, 0.1);
}

.intensity-title {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 6rpx;
}

.intensity-desc {
  font-size: 26rpx;
  color: #666;
}

.ai-hint {
  font-size: 26rpx;
  color: #666;
  margin: 20rpx 0;
}

.hint-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #666;
}

/* 预览区样式 */
.preview-content {
  background-color: #f9f9f9;
  border-radius: 16rpx;
  padding: 20rpx;
}

.preview-list {
  margin-bottom: 20rpx;
}

.preview-item {
  margin-bottom: 16rpx;
  padding-left: 20rpx;
  position: relative;
}

.preview-item::before {
  content: "•";
  position: absolute;
  left: 0;
}

.details-panel {
  border-top: 2rpx solid #eee;
  padding-top: 20rpx;
}

.details-header {
  display: flex;
  justify-content: space-between;
  color: #6654e0;
  padding: 10rpx 0;
}

.arrow {
  transition: all 0.3s;
}

.arrow-down {
  transform: rotate(180deg);
}

.details-content {
  margin-top: 20rpx;
}

.details-item {
  margin-bottom: 16rpx;
  padding-left: 20rpx;
  position: relative;
  color: #666;
}

.details-item::before {
  content: "•";
  position: absolute;
  left: 0;
}

/* 按钮样式 */
.action-buttons {
  display: flex;
  justify-content: space-between;
  padding: 0 30rpx 50rpx;
}

.action-buttons button {
  flex: 1;
  margin: 0 20rpx;
}

.action-buttons button[type="primary"] {
  background-color: #6654e0;
}
</style> 