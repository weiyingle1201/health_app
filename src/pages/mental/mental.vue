<template>
  <view class="mental-container">
    <!-- 心理健康状态卡片 -->
    <view class="status-card">
      <view class="card-header">
        <text class="section-title">您的心理健康</text>
      </view>
      
      <view class="mood-tracker">
        <text class="tracker-title">本周心情追踪</text>
        <view class="mood-chart">
          <view class="chart-days">
            <view class="day-item" v-for="(day, index) in weekDays" :key="index">
              <text class="day-text">{{ day }}</text>
              <view class="mood-icon" :class="getMoodClass(weekMoods[index])">
                <text class="iconfont">{{ getMoodIcon(weekMoods[index]) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="wellness-stats">
        <view class="stats-item">
          <text class="stats-label">睡眠质量</text>
          <view class="stats-value">
            <progress :percent="sleepQuality" stroke-width="3" active-color="#6654e0" />
            <text>{{ sleepQuality }}%</text>
          </view>
        </view>
        
        <view class="stats-item">
          <text class="stats-label">压力水平</text>
          <view class="stats-value">
            <progress :percent="stressLevel" stroke-width="3" active-color="#e9692c" />
            <text>{{ stressLevel }}%</text>
          </view>
        </view>
        
        <view class="stats-item">
          <text class="stats-label">心情稳定性</text>
          <view class="stats-value">
            <progress :percent="moodStability" stroke-width="3" active-color="#42b883" />
            <text>{{ moodStability }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 心情记录表单 -->
    <view class="mood-form">
      <view class="form-header">
        <text class="section-title">今日心情记录</text>
      </view>
      
      <view class="mood-selector">
        <view 
          v-for="(mood, index) in moodOptions" 
          :key="index"
          :class="['mood-option', { active: mentalForm.mood === mood.value }]"
          @click="selectMood(mood.value)"
        >
          <view class="mood-emoji">{{ mood.emoji }}</view>
          <text class="mood-label">{{ mood.label }}</text>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">睡眠时长 (小时)</text>
        <slider :min="0" :max="12" :step="0.5" :value="mentalForm.sleepHours" @change="onSleepHoursChange" show-value />
      </view>
      
      <view class="form-item">
        <text class="form-label">压力水平</text>
        <radio-group @change="onStressLevelChange">
          <label class="radio">
            <radio value="low" :checked="mentalForm.stressLevel === 'low'" />
            <text>低</text>
          </label>
          <label class="radio">
            <radio value="medium" :checked="mentalForm.stressLevel === 'medium'" />
            <text>中</text>
          </label>
          <label class="radio">
            <radio value="high" :checked="mentalForm.stressLevel === 'high'" />
            <text>高</text>
          </label>
        </radio-group>
      </view>
      
      <view class="form-item">
        <text class="form-label">影响心情的因素</text>
        <checkbox-group @change="onFactorsChange">
          <view class="checkbox-container">
            <label class="checkbox" v-for="(factor, index) in factors" :key="index">
              <checkbox :value="factor.value" :checked="selectedFactors.includes(factor.value)" />
              <text>{{ factor.label }}</text>
            </label>
          </view>
        </checkbox-group>
      </view>
      
      <view class="form-item">
        <text class="form-label">心情记录/日记</text>
        <textarea v-model="mentalForm.notes" placeholder="记录一下今天的心情和感受..." />
      </view>
      
      <button type="primary" :loading="loading" @click="handleSubmit" class="submit-btn">
        提交记录
      </button>
    </view>

    <!-- 放松活动推荐 -->
    <view class="relaxation-section">
      <view class="section-header">
        <text class="section-title">为您推荐的放松活动</text>
      </view>
      
      <view class="activities-list">
        <view class="activity-card" v-for="(activity, index) in relaxationActivities" :key="index">
          <view class="activity-icon">
            <text class="iconfont">{{ activity.icon }}</text>
          </view>
          <view class="activity-content">
            <text class="activity-title">{{ activity.title }}</text>
            <text class="activity-duration">{{ activity.duration }}分钟</text>
            <text class="activity-desc">{{ activity.description }}</text>
          </view>
          <button class="start-btn" size="mini" type="primary" @click="startActivity(activity)">开始</button>
        </view>
      </view>
    </view>

    <!-- 心理健康小贴士 -->
    <view class="tips-section">
      <view class="section-header">
        <text class="section-title">心理健康小贴士</text>
      </view>
      
      <view class="tips-card">
        <text class="tips-title">今日小贴士</text>
        <text class="tips-content">{{ dailyTip }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { submitCheckin, getCheckins } from '@/api/checkins';

export default {
  data() {
    return {
      // 表单数据
      mentalForm: {
        mood: '',
        sleepHours: 7,
        stressLevel: 'medium',
        factors: [],
        notes: ''
      },
      
      // 选项数据
      moodOptions: [
        { value: 'great', label: '很好', emoji: '😁' },
        { value: 'good', label: '好', emoji: '🙂' },
        { value: 'neutral', label: '一般', emoji: '😐' },
        { value: 'bad', label: '不好', emoji: '😔' },
        { value: 'terrible', label: '很差', emoji: '😣' }
      ],
      factors: [
        { value: 'work', label: '工作/学习' },
        { value: 'relationships', label: '人际关系' },
        { value: 'health', label: '身体健康' },
        { value: 'finance', label: '财务状况' },
        { value: 'sleep', label: '睡眠质量' },
        { value: 'weather', label: '天气' },
        { value: 'exercise', label: '运动' },
        { value: 'diet', label: '饮食' }
      ],
      selectedFactors: [],
      
      // 数据统计
      weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      weekMoods: ['great', 'good', 'neutral', 'good', 'bad', 'neutral', ''],
      sleepQuality: 75,
      stressLevel: 60,
      moodStability: 82,
      
      // 放松活动
      relaxationActivities: [
        {
          title: '呼吸冥想',
          duration: 5,
          icon: '\ue65f',
          description: '专注于呼吸，平静心情，缓解压力'
        },
        {
          title: '伸展放松',
          duration: 10,
          icon: '\ue622',
          description: '简单的伸展动作，放松身体肌肉'
        },
        {
          title: '舒缓音乐',
          duration: 15,
          icon: '\ue602',
          description: '聆听舒缓音乐，让心灵得到宁静'
        }
      ],
      
      // 小贴士
      dailyTip: '每天抽出10分钟进行深呼吸冥想，能有效降低压力水平，提高注意力集中度。',
      
      // 界面状态
      loading: false
    };
  },
  methods: {
    // 选择心情
    selectMood(mood) {
      this.mentalForm.mood = mood;
    },
    
    // 表单处理
    onSleepHoursChange(e) {
      this.mentalForm.sleepHours = e.detail.value;
    },
    onStressLevelChange(e) {
      this.mentalForm.stressLevel = e.detail.value;
    },
    onFactorsChange(e) {
      this.selectedFactors = e.detail.value;
      this.mentalForm.factors = this.selectedFactors;
    },
    
    // 获取心情图标
    getMoodIcon(mood) {
      const icons = {
        great: '\ue60a',
        good: '\ue637',
        neutral: '\ue636',
        bad: '\ue60c', 
        terrible: '\ue60d'
      };
      return icons[mood] || '\ue636';
    },
    
    // 获取心情样式类
    getMoodClass(mood) {
      return {
        'mood-great': mood === 'great',
        'mood-good': mood === 'good',
        'mood-neutral': mood === 'neutral',
        'mood-bad': mood === 'bad',
        'mood-terrible': mood === 'terrible',
        'mood-empty': !mood
      };
    },
    
    // 开始活动
    startActivity(activity) {
      uni.navigateTo({
        url: `/pages/mental/activity?title=${activity.title}&duration=${activity.duration}`
      });
    },
    
    // 提交记录
    async handleSubmit() {
      if (!this.mentalForm.mood) {
        uni.showToast({
          title: '请选择您的心情',
          icon: 'none'
        });
        return;
      }
      
      try {
        this.loading = true;
        await submitCheckin({
          type: 'mental',
          data: this.mentalForm,
          timestamp: new Date().toISOString()
        });
        
        uni.showToast({
          title: '心情记录提交成功',
          icon: 'success'
        });
        
        // 更新今天的心情
        const today = new Date().getDay() - 1;
        if (today >= 0 && today < 7) {
          this.$set(this.weekMoods, today, this.mentalForm.mood);
        }
        
        // 重置表单
        this.mentalForm = {
          mood: '',
          sleepHours: 7,
          stressLevel: 'medium',
          factors: [],
          notes: ''
        };
        this.selectedFactors = [];
        
      } catch (error) {
        uni.showToast({
          title: '心情记录提交失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    // 加载数据
    async loadMentalData() {
      try {
        const response = await getCheckins({
          type: 'mental',
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        });
        
        if (response && response.data && response.data.checkins) {
          // 处理过去一周的心情数据
          const weekMoods = [...this.weekMoods];
          const today = new Date().getDay() - 1; // 0是周一
          
          response.data.checkins.forEach(checkin => {
            const date = new Date(checkin.timestamp);
            const dayOfWeek = date.getDay() - 1; // 转换为0-6，0是周一
            
            // 确保是过去7天内的数据
            if (dayOfWeek >= 0 && dayOfWeek < 7 && dayOfWeek <= today) {
              weekMoods[dayOfWeek] = checkin.data.mood;
            }
          });
          
          this.weekMoods = weekMoods;
          
          // 计算统计数据
          // 这里为简化，使用模拟数据，实际应根据历史记录计算
          this.calculateStats(response.data.checkins);
        }
      } catch (error) {
        console.error('加载心理健康数据失败', error);
      }
    },
    
    // 计算统计数据
    calculateStats(checkins) {
      if (!checkins || checkins.length === 0) return;
      
      // 这里应该根据实际数据计算，这里简化处理
      // 睡眠质量：根据睡眠时长计算，7-8小时为最佳
      let sleepSum = 0;
      let sleepCount = 0;
      
      // 压力水平：根据记录的压力水平计算
      let stressSum = 0;
      let stressCount = 0;
      
      // 心情稳定性：根据心情变化计算
      let moodValues = [];
      
      checkins.forEach(checkin => {
        if (checkin.data.sleepHours) {
          sleepSum += Math.min(100, checkin.data.sleepHours >= 7 && checkin.data.sleepHours <= 8 ? 100 : 
                              checkin.data.sleepHours > 8 ? 80 : 
                              checkin.data.sleepHours >= 6 ? 70 : 50);
          sleepCount++;
        }
        
        if (checkin.data.stressLevel) {
          stressSum += checkin.data.stressLevel === 'low' ? 30 :
                     checkin.data.stressLevel === 'medium' ? 60 : 90;
          stressCount++;
        }
        
        if (checkin.data.mood) {
          const moodValue = checkin.data.mood === 'great' ? 5 :
                          checkin.data.mood === 'good' ? 4 :
                          checkin.data.mood === 'neutral' ? 3 :
                          checkin.data.mood === 'bad' ? 2 : 1;
          moodValues.push(moodValue);
        }
      });
      
      if (sleepCount > 0) {
        this.sleepQuality = Math.round(sleepSum / sleepCount);
      }
      
      if (stressCount > 0) {
        this.stressLevel = Math.round(stressSum / stressCount);
      }
      
      if (moodValues.length > 1) {
        // 计算心情稳定性：变化越小越稳定
        let moodVariation = 0;
        for (let i = 1; i < moodValues.length; i++) {
          moodVariation += Math.abs(moodValues[i] - moodValues[i-1]);
        }
        const averageVariation = moodVariation / (moodValues.length - 1);
        // 转换为稳定性百分比：变化为0是100%稳定，变化为4是0%稳定
        this.moodStability = Math.round(100 - (averageVariation / 4 * 100));
      }
    }
  },
  onLoad() {
    this.loadMentalData();
    
    // 获取每日小贴士
    const tips = [
      '每天抽出10分钟进行深呼吸冥想，能有效降低压力水平，提高注意力集中度。',
      '保持充足的睡眠对心理健康至关重要，尝试每晚保持7-8小时的睡眠。',
      '与朋友或家人交流您的感受可以减轻心理负担，不要把情绪闷在心里。',
      '运动能促进身体释放内啡肽，即使是短暂的散步也能提升心情。',
      '保持健康的饮食习惯可以影响您的情绪和能量水平，尽量减少咖啡因和糖的摄入。',
      '学会说"不"是自我关爱的一部分，不要因为担心别人的看法而勉强自己。',
      '每天记录三件感恩的事情可以培养积极思维，提高幸福感。'
    ];
    
    // 随机选择一条小贴士
    this.dailyTip = tips[Math.floor(Math.random() * tips.length)];
  }
};
</script>

<style>
page {
  background-color: #f5f5f5;
}

.mental-container {
  padding: 20rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.status-card,
.mood-form,
.relaxation-section,
.tips-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.card-header,
.form-header,
.section-header {
  margin-bottom: 30rpx;
}

/* 心情追踪样式 */
.mood-tracker {
  margin-bottom: 30rpx;
}

.tracker-title {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.mood-chart {
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 16rpx;
}

.chart-days {
  display: flex;
  justify-content: space-between;
}

.day-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-text {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.mood-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36rpx;
}

.mood-great {
  background-color: #4cd964;
  color: #fff;
}

.mood-good {
  background-color: #5ac8fa;
  color: #fff;
}

.mood-neutral {
  background-color: #ffcc00;
  color: #fff;
}

.mood-bad {
  background-color: #ff9500;
  color: #fff;
}

.mood-terrible {
  background-color: #ff3b30;
  color: #fff;
}

.mood-empty {
  background-color: #e0e0e0;
  color: #999;
}

/* 统计卡片样式 */
.wellness-stats {
  margin-top: 30rpx;
}

.stats-item {
  margin-bottom: 20rpx;
}

.stats-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.stats-value {
  display: flex;
  align-items: center;
}

.stats-value progress {
  flex: 1;
  margin-right: 20rpx;
}

.stats-value text {
  width: 60rpx;
  text-align: right;
  font-size: 24rpx;
  color: #666;
}

/* 心情选择器样式 */
.mood-selector {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.mood-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  border-radius: 16rpx;
  border: 2rpx solid #eee;
  transition: all 0.3s;
}

.mood-option.active {
  transform: scale(1.05);
  border-color: #6654e0;
  background-color: rgba(102, 84, 224, 0.1);
}

.mood-emoji {
  font-size: 40rpx;
  margin-bottom: 10rpx;
}

.mood-label {
  font-size: 24rpx;
  color: #333;
}

/* 表单样式 */
.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.radio {
  margin-right: 30rpx;
}

.checkbox-container {
  display: flex;
  flex-wrap: wrap;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  width: 33.33%;
  margin-bottom: 16rpx;
}

.submit-btn {
  margin-top: 40rpx;
  background-color: #6654e0;
}

/* 放松活动样式 */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.activity-card {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-radius: 16rpx;
  background-color: #f9f9f9;
}

.activity-icon {
  font-size: 50rpx;
  color: #6654e0;
  margin-right: 20rpx;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.activity-duration {
  font-size: 24rpx;
  color: #666;
  margin: 6rpx 0;
  display: block;
}

.activity-desc {
  font-size: 26rpx;
  color: #666;
  display: block;
}

.start-btn {
  background-color: #6654e0;
}

/* 小贴士样式 */
.tips-card {
  padding: 20rpx;
  border-radius: 16rpx;
  background-color: #f9f9f9;
}

.tips-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.tips-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}
</style> 