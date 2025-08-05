<template>
  <div class="exercise-container">
    <!-- 当前运动目标卡片 -->
    <el-card class="goal-card">
      <template #header>
        <div class="goal-header">
          <h3>您的运动目标</h3>
          <el-button type="primary" size="small" round @click="goToAddGoal">+ 添加运动目标</el-button>
        </div>
      </template>
      
      <div v-if="!hasGoals && !goalsLoading" class="empty-goals">
        <el-empty description="您还没有设置运动目标">
          <el-button type="primary" @click="goToAddGoal">立即设置</el-button>
        </el-empty>
      </div>
      
      <div v-else-if="goalsLoading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>
      
      <div v-else class="goals-preview">
        <div class="goal-item" v-for="(goal, index) in exerciseGoals" :key="index">
          <div class="goal-icon">
            <component :is="getGoalIcon(goal.type)" />
          </div>
          <div class="goal-content">
            <h4>{{ goal.title }}</h4>
            <div class="goal-progress">
              <el-progress :percentage="goal.progress" :format="percent => `${percent}%`" />
            </div>
            <p class="goal-description">{{ goal.description }}</p>
          </div>
          <div class="goal-actions">
            <el-button v-if="goal.recordable" size="small" @click="recordActivity(goal)">
              记录活动
            </el-button>
            <el-button v-if="goal.type === 'steps'" size="small" @click="recordActivity(goal)" :disabled="goal.completed">
              {{ goal.completed ? '已完成' : '完成' }}
            </el-button>
          </div>
        </div>
    </div>
    </el-card>

    <!-- 运动打卡表单 -->
    <el-card class="exercise-form">
      <template #header>
        <h3>运动打卡</h3>
      </template>
      <el-form :model="exerciseForm" @submit.prevent="handleSubmit">
        <el-form-item label="运动类型">
          <el-select v-model="exerciseForm.exerciseType" placeholder="请选择运动类型">
            <el-option label="跑步" value="running" />
            <el-option label="步行" value="walking" />
            <el-option label="骑行" value="cycling" />
            <el-option label="游泳" value="swimming" />
            <el-option label="健身" value="workout" />
          </el-select>
        </el-form-item>
        <el-form-item label="运动时长(分钟)">
          <el-input-number v-model="exerciseForm.duration" :min="0" />
        </el-form-item>
        <el-form-item label="运动强度">
          <el-radio-group v-model="exerciseForm.intensity">
            <el-radio label="low">低强度</el-radio>
            <el-radio label="medium">中等强度</el-radio>
            <el-radio label="high">高强度</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消耗卡路里">
          <el-input-number v-model="exerciseForm.calories" :min="0" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="exerciseForm.notes"
            type="textarea"
            placeholder="记录一下运动感受吧"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            提交打卡
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 运动历史记录 -->
    <el-card class="exercise-history">
      <template #header>
        <h3>运动记录</h3>
      </template>
      <el-table
        v-loading="historyLoading"
        :data="exerciseHistory"
        style="width: 100%"
      >
        <el-table-column prop="data.exerciseType" label="运动类型">
          <template #default="{ row }">
            {{ {
              running: '跑步',
              walking: '步行',
              cycling: '骑行',
              swimming: '游泳',
              workout: '健身'
            }[row.data.exerciseType] }}
          </template>
        </el-table-column>
        <el-table-column prop="data.duration" label="时长(分钟)" />
        <el-table-column prop="data.intensity" label="强度">
          <template #default="{ row }">
            {{ {
              low: '低强度',
              medium: '中等强度',
              high: '高强度'
            }[row.data.intensity] }}
          </template>
        </el-table-column>
        <el-table-column prop="data.calories" label="卡路里" />
        <el-table-column prop="timestamp" label="打卡时间">
          <template #default="{ row }">
            {{ new Date(row.timestamp).toLocaleString() }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { submitCheckin, getCheckins } from '@/api/checkins';
import { getGoals } from '@/api/goals';
import { ElMessage } from 'element-plus';

export default {
  name: 'ExerciseView',
  setup() {
    const router = useRouter();
    const exerciseForm = ref({
      exerciseType: '',
      duration: 0,
      intensity: 'medium',
      calories: 0,
      notes: ''
    });

    const exerciseHistory = ref([]);
    const loading = ref(false);
    const historyLoading = ref(false);
    const goalsLoading = ref(false);
    const exerciseGoals = ref([]);

    const hasGoals = computed(() => exerciseGoals.value.length > 0);

    // 获取用户的运动目标
    const loadExerciseGoals = async () => {
      try {
        goalsLoading.value = true;
        const response = await getGoals();
        
        // 假设API返回的数据需要转换成我们需要的格式
        if (response && response.data && response.data.goals && response.data.goals.exercise) {
          const goals = response.data.goals.exercise;
          
          // 示例数据，实际应根据API返回的数据结构进行调整
          exerciseGoals.value = [
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
        ElMessage.error('获取运动目标失败');
        console.error(error);
      } finally {
        goalsLoading.value = false;
      }
    };

    const loadExerciseHistory = async () => {
      try {
        historyLoading.value = true;
        const response = await getCheckins({
          type: 'exercise',
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        });
        exerciseHistory.value = response.data.checkins;
      } catch (error) {
        ElMessage.error('获取运动记录失败');
      } finally {
        historyLoading.value = false;
      }
    };

    const handleSubmit = async () => {
      try {
        loading.value = true;
        await submitCheckin({
          type: 'exercise',
          data: exerciseForm.value,
          timestamp: new Date().toISOString()
        });
        ElMessage.success('运动打卡成功');
        exerciseForm.value = {
          exerciseType: '',
          duration: 0,
          intensity: 'medium',
          calories: 0,
          notes: ''
        };
        loadExerciseHistory();
        loadExerciseGoals(); // 刷新目标完成情况
      } catch (error) {
        ElMessage.error('运动打卡失败');
      } finally {
        loading.value = false;
      }
    };

    const goToAddGoal = () => {
      router.push('/exercise/add-goal');
    };

    const recordActivity = (goal) => {
      // 根据目标类型预填充表单
      exerciseForm.value.exerciseType = goal.type === 'swimming' ? 'swimming' : 
                                       goal.type === 'strength' ? 'workout' : 'walking';
      // 滚动到打卡表单
      document.querySelector('.exercise-form').scrollIntoView({ behavior: 'smooth' });
    };

    const getGoalIcon = (type) => {
      const icons = {
        steps: 'el-icon-s-operation',
        strength: 'el-icon-trophy',
        swimming: 'el-icon-ship'
      };
      return icons[type] || 'el-icon-s-flag';
    };

    onMounted(() => {
      loadExerciseHistory();
      loadExerciseGoals();
    });

    return {
      exerciseForm,
      exerciseHistory,
      exerciseGoals,
      loading,
      historyLoading,
      goalsLoading,
      hasGoals,
      handleSubmit,
      goToAddGoal,
      recordActivity,
      getGoalIcon
    };
  }
};
</script>

<style scoped>
.exercise-container {
  padding: 20px;
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}

.goal-card, 
.exercise-form,
.exercise-history {
  height: fit-content;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-goals {
  padding: 20px 0;
}

.goals-preview {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.goal-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.goal-icon {
  font-size: 2rem;
  color: #409EFF;
  margin-right: 15px;
}

.goal-content {
  flex: 1;
}

.goal-content h4 {
  margin: 0 0 10px;
}

.goal-description {
  margin: 10px 0 0;
  font-size: 0.9rem;
  color: #666;
}

.goal-actions {
  margin-left: 15px;
}

.loading-container {
  padding: 20px 0;
}

@media (min-width: 992px) {
  .exercise-container {
    grid-template-columns: 1fr 1fr;
  }
  
  .goal-card {
    grid-column: 1 / -1;
  }
}
</style> 