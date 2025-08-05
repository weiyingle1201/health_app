<template>
  <div class="home">
    <HeaderBar :userName="userInfo.nickname || ''" @avatar-click="onAvatarClick" @notification-click="onNotificationClick" @settings-click="onSettingsClick" />
    <h1>首页</h1>
    <div class="content">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="goals.length > 0" class="card" v-for="goal in goals" :key="goal.id">
        <h2>{{ getGoalTypeText(goal.type) }}</h2>
        <div class="goal-info">
          <p>开始时间: {{ formatDate(goal.startDate) }}</p>
          <p>结束时间: {{ formatDate(goal.endDate) }}</p>
          <div v-if="goalDetailsMap[goal.id]">
            <p>每周天数: {{ goalDetailsMap[goal.id].daysPerWeek }}</p>
            <p>每日时长: {{ goalDetailsMap[goal.id].durationPerDay }} 分钟</p>
            <p>饮食类型: {{ getDietTypeText(goalDetailsMap[goal.id].dietType) }}</p>
          </div>
        </div>
      </div>
      <div v-else class="card">
        <h2>暂无目标</h2>
        <button class="primary-button" @click="setGoal">设置目标</button>
      </div>
      <div class="card">
        <h2>活动建议</h2>
        <div class="activity-item">
          <div class="activity-icon">🏃</div>
          <div class="activity-info">
            <h3>慢跑</h3>
            <p>30分钟，消耗200卡路里</p>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-icon">🚴</div>
          <div class="activity-info">
            <h3>骑行</h3>
            <p>45分钟，消耗300卡路里</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <TabsNav />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import TabsNav from '../components/TabsNav.vue';
import HeaderBar from '../components/HeaderBar.vue';
import { getGoals } from '@/api/goals';
import { getUserInfo } from '@/api/user';

const loading = ref(false);
const error = ref(null);
const goals = ref([]);
const goalDetailsMap = ref({});
const userInfo = ref({});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await getUserInfo();
    userInfo.value = response.data.userInfo;
  } catch (err) {
    console.error('获取用户信息失败:', err);
  }
};

// 获取用户目标
const fetchGoals = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getGoals();
    goals.value = response.data.goal;
    // 将目标详情按目标 ID 存储到映射中
    goalDetailsMap.value = response.data.goalDetails.reduce((map, detail) => {
      map[detail.goalId] = detail;
      return map;
    }, {});
  } catch (err) {
    error.value = '获取目标失败，请稍后重试';
    console.error('获取目标失败:', err);
  } finally {
    loading.value = false;
  }
};

// 设置目标
const setGoal = () => {
  // TODO: 导航到设置目标页面
  console.log('跳转到设置目标页面');
};

const onAvatarClick = () => {
  // TODO: 导航到个人中心页面
  console.log('跳转到个人中心页面');
};

const onNotificationClick = () => {
  // TODO: 打开通知面板
  console.log('打开通知面板');
};

const onSettingsClick = () => {
  // TODO: 打开设置面板
  console.log('打开设置面板');
};

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};

// 获取目标类型文本
const getGoalTypeText = (type) => {
  const typeMap = {
    'exercise': '运动目标',
    // 可根据需要添加更多类型
  };
  return typeMap[type] || type;
};

// 获取饮食类型文本
const getDietTypeText = (type) => {
  const typeMap = {
    'lose': '减脂',
    // 可根据需要添加更多类型
  };
  return typeMap[type] || type;
};

onMounted(() => {
  fetchUserInfo();
  fetchGoals();
});
</script>

<style scoped>
.home {
  padding: 20px;
  padding-bottom: 70px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #333;
}

.progress-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(#4CAF50 0% 75%, #e0e0e0 75% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  position: relative;
}

.progress-circle::before {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
}

.percentage {
  position: relative;
  z-index: 1;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.primary-button {
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  width: 100%;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.primary-button:hover {
  background: #388E3C;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.activity-info h3 {
  margin: 0;
  font-size: 1rem;
}

.activity-info p {
  margin: 5px 0 0;
  color: #666;
  font-size: 0.9rem;
}

.loading, .error {
  padding: 20px;
  text-align: center;
  font-size: 1rem;
}

.error {
  color: #f44336;
}

.goal-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.goal-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}
</style>