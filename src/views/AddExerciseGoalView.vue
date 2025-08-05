<template>
  <div class="add-goal-container">
    <!-- 大目标选择区 -->
    <section class="goal-section">
      <h2 class="section-title">选择您的主要运动目标</h2>
      <div class="goal-cards">
        <div 
          v-for="(goal, index) in mainGoals" 
          :key="index"
          :class="['goal-card', { 'active': selectedMainGoal === goal.value }]"
          @click="selectedMainGoal = goal.value"
        >
          <div class="goal-icon">
            <i :class="goal.icon"></i>
          </div>
          <div class="goal-info">
            <h3>{{ goal.label }}</h3>
            <p>{{ goal.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 运动偏好设置 -->
    <section class="preference-section">
      <h2 class="section-title">您的运动偏好</h2>
      
      <div class="preference-item">
        <h3>运动类型 <span class="hint">(最多选3个)</span></h3>
        <div class="exercise-types">
          <el-checkbox-group v-model="selectedExerciseTypes" :max="3">
            <el-checkbox 
              v-for="type in filteredExerciseTypes" 
              :key="type.value" 
              :label="type.value"
            >
              {{ type.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      
      <div class="preference-item">
        <h3>每周可用时间: {{ weeklyHours }}小时</h3>
        <el-slider 
          v-model="weeklyHours"
          :min="3"
          :max="10"
          :step="0.5"
          show-stops
        ></el-slider>
      </div>
      
      <div class="preference-item">
        <h3>是否有运动设备？</h3>
        <el-switch v-model="hasEquipment"></el-switch>
      </div>
    </section>

    <!-- 智能拆解设置 -->
    <section class="ai-section">
      <h2 class="section-title">
        <span class="ai-icon"><i class="el-icon-cpu"></i></span>
        AI智能拆解您的目标
      </h2>
      
      <div class="intensity-options">
        <div 
          v-for="intensity in intensityOptions" 
          :key="intensity.value"
          :class="['intensity-card', { 'active': selectedIntensity === intensity.value }]"
          @click="selectedIntensity = intensity.value"
        >
          <h3>{{ intensity.label }}</h3>
          <p>{{ intensity.description }}</p>
        </div>
      </div>
      
      <p class="ai-hint">AI将根据您的选择拆解为每日/每周可执行的小目标</p>
      <el-tooltip content="AI通过分析您的选择，结合运动科学原理，为您制定循序渐进的目标">
        <el-button size="small" circle><i class="el-icon-question"></i></el-button>
      </el-tooltip>
    </section>

    <!-- 预览区 -->
    <section class="preview-section">
      <h2 class="section-title">您的目标预览</h2>
      
      <div class="preview-content">
        <ul>
          <li v-for="(item, index) in goalPreview" :key="index">
            {{ item }}
          </li>
        </ul>
        
        <el-collapse>
          <el-collapse-item title="查看详细拆解">
            <ul class="detail-list">
              <li v-for="(detail, index) in goalDetails" :key="index">
                {{ detail }}
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>

    <!-- 提交按钮 -->
    <div class="action-buttons">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="saveGoal" :loading="loading">保存目标</el-button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { setGoals } from '@/api/goals';

export default {
  name: 'AddExerciseGoalView',
  setup() {
    const router = useRouter();
    const loading = ref(false);

    // 主要目标选项
    const mainGoals = [
      { 
        label: '减脂塑形', 
        value: 'fat-loss', 
        icon: 'el-icon-running', 
        description: '通过有氧运动减少脂肪' 
      },
      { 
        label: '增肌力量', 
        value: 'muscle-gain', 
        icon: 'el-icon-dumbbell', 
        description: '通过力量训练增加肌肉量' 
      },
      { 
        label: '提升耐力', 
        value: 'endurance', 
        icon: 'el-icon-heart', 
        description: '提高心肺功能和运动持久力' 
      },
      { 
        label: '柔韧平衡', 
        value: 'flexibility', 
        icon: 'el-icon-yoga', 
        description: '增加身体柔韧性和平衡能力' 
      }
    ];

    // 所有运动类型
    const allExerciseTypes = [
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
    ];

    // 强度选项
    const intensityOptions = [
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
    ];

    // 状态变量
    const selectedMainGoal = ref('fat-loss');
    const selectedExerciseTypes = ref([]);
    const weeklyHours = ref(5);
    const hasEquipment = ref(false);
    const selectedIntensity = ref('balanced');

    // 根据选择的主目标过滤运动类型
    const filteredExerciseTypes = computed(() => {
      return allExerciseTypes.filter(type => 
        type.goals.includes(selectedMainGoal.value)
      );
    });

    // 预览目标
    const goalPreview = computed(() => {
      if (!selectedMainGoal.value || selectedExerciseTypes.value.length === 0) {
        return ['请选择运动目标和类型以查看预览'];
      }

      const preview = [];
      const types = selectedExerciseTypes.value.map(value => {
        const type = allExerciseTypes.find(t => t.value === value);
        return type ? type.label : value;
      });

      // 根据不同目标和强度生成不同预览
      if (selectedMainGoal.value === 'fat-loss') {
        const frequency = selectedIntensity.value === 'mild' ? 2 : 
                         selectedIntensity.value === 'balanced' ? 3 : 4;
        const duration = selectedIntensity.value === 'mild' ? '20-30' : 
                        selectedIntensity.value === 'balanced' ? '30-40' : '40-50';
        
        preview.push(`每周${frequency}次${types[0] || '有氧运动'}，每次${duration}分钟`);
        preview.push('每天记录饮食和运动情况');
        
        if (selectedIntensity.value !== 'mild') {
          preview.push('心率维持在120-150区间');
        }
      } 
      else if (selectedMainGoal.value === 'muscle-gain') {
        const frequency = selectedIntensity.value === 'mild' ? 2 : 
                         selectedIntensity.value === 'balanced' ? 3 : 4;
        
        preview.push(`每周${frequency}次力量训练，分别锻炼不同肌群`);
        if (hasEquipment.value) {
          preview.push('利用哑铃进行递增式负重训练');
        } else {
          preview.push('利用自身体重进行递增式训练');
        }
      }
      else if (selectedMainGoal.value === 'endurance') {
        const increment = selectedIntensity.value === 'mild' ? '5%' : 
                         selectedIntensity.value === 'balanced' ? '10%' : '15%';
        
        preview.push(`每周进行${Math.ceil(weeklyHours.value/2)}次${types[0] || '耐力训练'}`);
        preview.push(`每周增加训练时间${increment}`);
      }
      else if (selectedMainGoal.value === 'flexibility') {
        const frequency = selectedIntensity.value === 'mild' ? 2 : 
                         selectedIntensity.value === 'balanced' ? 4 : 6;
        
        preview.push(`每周${frequency}次柔韧性训练，每次15-20分钟`);
        preview.push('每天进行5分钟全身拉伸');
      }

      return preview;
    });

    // 详细目标拆解
    const goalDetails = computed(() => {
      if (!selectedMainGoal.value || selectedExerciseTypes.value.length === 0) {
        return [];
      }

      const details = [];
      
      if (selectedMainGoal.value === 'fat-loss') {
        details.push('周一、周三、周五：有氧训练，保持心率在目标区间');
        details.push('周二、周六：力量训练，增加代谢率');
        details.push('每日记录体重和身体围度变化');
        details.push('控制每日热量摄入，确保适度热量赤字');
      } 
      else if (selectedMainGoal.value === 'muscle-gain') {
        details.push('周一：上肢力量训练（胸、肩、三头肌）');
        details.push('周三：下肢力量训练（大腿、臀部、小腿）');
        details.push('周五：背部和手臂训练（背阔肌、二头肌）');
        details.push('每组8-12次，3-4组，训练至肌肉疲劳');
        details.push('确保每日摄入足够蛋白质（体重×1.6-2.0g）');
      }
      else if (selectedMainGoal.value === 'endurance') {
        details.push('第1-2周：建立基础耐力，低强度长时间训练');
        details.push('第3-4周：加入中等强度间歇训练，提高有氧能力');
        details.push('第5-6周：增加高强度间歇训练比例，突破平台期');
        details.push('每周安排1-2天完全休息，促进恢复');
      }
      else if (selectedMainGoal.value === 'flexibility') {
        details.push('晨起5分钟全身唤醒拉伸');
        details.push('周二、周四：15-20分钟全面柔韧性训练');
        details.push('周六：30分钟深度柔韧和平衡训练');
        details.push('每次训练后5分钟冷静放松');
        details.push('每个姿势保持20-30秒，感受拉伸不要用力过猛');
      }

      return details;
    });

    // 当主目标改变时，重置选择的运动类型
    watch(selectedMainGoal, () => {
      selectedExerciseTypes.value = [];
    });

    // 保存目标
    const saveGoal = async () => {
      if (selectedExerciseTypes.value.length === 0) {
        ElMessage.warning('请至少选择一种运动类型');
        return;
      }

      try {
        loading.value = true;
        
        // 构造提交的数据
        const goalData = {
          selectedGoals: ['exercise'],
          exerciseGoals: {
            mainGoal: selectedMainGoal.value,
            exerciseTypes: selectedExerciseTypes.value,
            weeklyHours: weeklyHours.value,
            hasEquipment: hasEquipment.value,
            intensity: selectedIntensity.value,
            daysPerWeek: Math.min(Math.ceil(weeklyHours.value / 2), 7)
          }
        };
        
        await setGoals(goalData);
        ElMessage.success('运动目标设置成功');
        router.push('/exercise');
      } catch (error) {
        ElMessage.error('保存目标失败，请重试');
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      router.go(-1);
    };

    return {
      mainGoals,
      filteredExerciseTypes,
      intensityOptions,
      selectedMainGoal,
      selectedExerciseTypes,
      weeklyHours,
      hasEquipment,
      selectedIntensity,
      goalPreview,
      goalDetails,
      loading,
      saveGoal,
      goBack
    };
  }
};
</script>

<style scoped>
.add-goal-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

section {
  margin-bottom: 40px;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 目标卡片样式 */
.goal-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.goal-card {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.goal-card.active {
  border-color: #409EFF;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.goal-icon {
  font-size: 40px;
  margin-bottom: 10px;
  color: #409EFF;
}

.goal-info h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
}

.goal-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

/* 偏好设置样式 */
.preference-item {
  margin-bottom: 25px;
}

.preference-item h3 {
  margin: 0 0 10px;
  font-size: 1rem;
  font-weight: 500;
}

.hint {
  font-size: 0.8rem;
  color: #909399;
  font-weight: normal;
}

.exercise-types {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* AI部分样式 */
.ai-section h2 {
  display: flex;
  align-items: center;
}

.ai-icon {
  margin-right: 10px;
  background: linear-gradient(45deg, #6754e2, #19bfd3);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intensity-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.intensity-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.intensity-card.active {
  border-color: #409EFF;
  background-color: rgba(64, 158, 255, 0.1);
}

.intensity-card h3 {
  margin: 0 0 10px;
  font-size: 1rem;
}

.intensity-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.ai-hint {
  font-size: 0.9rem;
  color: #666;
  margin: 20px 0 10px;
}

/* 预览区样式 */
.preview-content {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
}

.preview-content ul {
  padding-left: 20px;
  margin: 0 0 15px;
}

.preview-content li {
  margin-bottom: 8px;
}

.detail-list {
  padding-left: 20px;
  color: #666;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .goal-cards,
  .intensity-options {
    grid-template-columns: 1fr;
  }
}
</style> 