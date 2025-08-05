<template>
  <view class="container">
    <uni-card>
      <uni-section title="我的目标" type="line">
        <uni-list>
          <uni-list-item 
            v-for="goal in goals" 
            :key="goal.id"
            :title="goal.type"
            :note="`${formatDate(goal.startDate)} 至 ${formatDate(goal.endDate)}`"
            show-extra-icon
            :extra-icon="{type: 'star-filled', color: '#ffca28'}"
          />
        </uni-list>
      </uni-section>
    </uni-card>
    <button @click="navigateToAddGoal">添加新目标</button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGoals } from '@/api/goals';

const goals = ref([]);

const fetchGoals = async () => {
  try {
    const res = await getGoals();
    goals.value = res.data.goal;
  } catch (error) {
    uni.showToast({ title: '获取目标失败', icon: 'none' });
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const navigateToAddGoal = () => {
  uni.navigateTo({ url: '/pages/add-goal/add-goal' });
};

onMounted(() => {
  fetchGoals();
});
</script>