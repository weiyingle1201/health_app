<template>
  <view class="add-goal-container">
    <!-- 大目标选择区 -->
    <view class="section goal-section">
      <text class="section-title">选择您的主要饮食目标</text>
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

    <!-- 饮食偏好设置 -->
    <view class="section preference-section">
      <text class="section-title">您的饮食偏好</text>
      
      <view class="preference-item">
        <text class="item-title">是否有食物过敏/忌口</text>
        <switch :checked="hasDietaryRestrictions" @change="onDietaryRestrictionsChange" />
      </view>
      
      <view class="preference-item" v-if="hasDietaryRestrictions">
        <text class="item-title">食物过敏/忌口</text>
        <checkbox-group @change="onAllergiesChange">
          <view class="checkbox-container">
            <label class="checkbox" v-for="(allergy, index) in allergiesOptions" :key="index">
              <checkbox :value="allergy.value" :checked="selectedAllergies.includes(allergy.value)" />
              <text>{{ allergy.label }}</text>
            </label>
          </view>
        </checkbox-group>
        <view class="form-item">
          <text class="form-label">其他忌口</text>
          <input v-model="otherAllergies" placeholder="请输入其他忌口食物" />
        </view>
      </view>
      
      <view class="preference-item">
        <text class="item-title">饮食习惯</text>
        <radio-group @change="onDietTypeChange">
          <label class="radio">
            <radio value="normal" :checked="dietForm.dietType === 'normal'" />
            <text>常规饮食</text>
          </label>
          <label class="radio">
            <radio value="vegetarian" :checked="dietForm.dietType === 'vegetarian'" />
            <text>素食主义</text>
          </label>
          <label class="radio">
            <radio value="vegan" :checked="dietForm.dietType === 'vegan'" />
            <text>纯素食主义</text>
          </label>
        </radio-group>
      </view>
      
      <view class="preference-item">
        <text class="item-title">每日餐次: {{ dietForm.mealsPerDay }}餐</text>
        <slider 
          :value="dietForm.mealsPerDay"
          :min="3"
          :max="6"
          :step="1"
          show-value
          @change="onMealsPerDayChange"
        />
      </view>
    </view>

    <!-- 目标设置 -->
    <view class="section goal-details-section">
      <text class="section-title">详细目标设置</text>
      
      <view class="form-item">
        <text class="form-label">每日卡路里目标</text>
        <slider :min="1500" :max="3000" :step="100" :value="dietForm.caloriesGoal" @change="onCaloriesGoalChange" show-value />
      </view>
      
      <view class="form-item">
        <text class="form-label">蛋白质比例</text>
        <slider :min="10" :max="40" :step="5" :value="dietForm.proteinPercentage" @change="onProteinChange" show-value />
        <text class="hint-text">推荐: 15-35%</text>
      </view>
      
      <view class="form-item">
        <text class="form-label">碳水化合物比例</text>
        <slider :min="30" :max="65" :step="5" :value="dietForm.carbsPercentage" @change="onCarbsChange" show-value />
        <text class="hint-text">推荐: 45-65%</text>
      </view>
      
      <view class="form-item">
        <text class="form-label">脂肪比例</text>
        <slider :min="10" :max="40" :step="5" :value="dietForm.fatPercentage" @change="onFatChange" show-value />
        <text class="hint-text">推荐: 20-35%</text>
      </view>
      
      <view class="macros-total">
        <text :class="['total-text', { 'warning': macrosTotal !== 100 }]">
          总计: {{ macrosTotal }}% {{ macrosTotal === 100 ? '✓' : '(应为100%)' }}
        </text>
      </view>
      
      <view class="form-item">
        <text class="form-label">每日饮水目标 (毫升)</text>
        <slider :min="1500" :max="3500" :step="100" :value="dietForm.waterGoal" @change="onWaterGoalChange" show-value />
      </view>
    </view>

    <!-- 饮食建议 -->
    <view class="section suggestions-section">
      <view class="suggestions-header">
        <text class="section-title">基于您的目标的饮食建议</text>
      </view>
      
      <view class="suggestions-content">
        <text class="suggestions-title">推荐食物</text>
        <view class="food-groups">
          <view class="food-group" v-for="(group, index) in recommendedFoods" :key="index">
            <text class="food-group-title">{{ group.category }}</text>
            <text class="food-group-items">{{ group.foods.join(', ') }}</text>
          </view>
        </view>
        
        <text class="suggestions-title">建议减少的食物</text>
        <view class="food-groups">
          <view class="food-group" v-for="(group, index) in foodsToReduce" :key="index">
            <text class="food-group-title">{{ group.category }}</text>
            <text class="food-group-items">{{ group.foods.join(', ') }}</text>
          </view>
        </view>
        
        <text class="suggestions-title">餐食建议</text>
        <view class="meal-suggestions">
          <view class="meal-card" v-for="(meal, index) in mealSuggestions" :key="index">
            <text class="meal-title">{{ meal.title }}</text>
            <text class="meal-desc">{{ meal.description }}</text>
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
          label: '均衡营养', 
          value: 'balanced', 
          icon: '\ue606', 
          description: '追求全面均衡的营养摄入' 
        },
        { 
          label: '体重管理', 
          value: 'weight-management', 
          icon: '\ue692', 
          description: '控制或减轻体重' 
        },
        { 
          label: '提升能量', 
          value: 'energy', 
          icon: '\ue600', 
          description: '提高日常活力和精力' 
        },
        { 
          label: '健康肠道', 
          value: 'gut-health', 
          icon: '\ue60b', 
          description: '改善消化系统健康' 
        }
      ],
      
      // 过敏选项
      allergiesOptions: [
        { label: '乳制品', value: 'dairy' },
        { label: '坚果', value: 'nuts' },
        { label: '海鲜', value: 'seafood' },
        { label: '麸质', value: 'gluten' },
        { label: '鸡蛋', value: 'eggs' },
        { label: '大豆', value: 'soy' }
      ],
      
      // 表单数据
      dietForm: {
        dietType: 'normal',
        mealsPerDay: 3,
        caloriesGoal: 2000,
        proteinPercentage: 20,
        carbsPercentage: 50,
        fatPercentage: 30,
        waterGoal: 2000,
        allergies: []
      },
      
      // 偏好状态
      hasDietaryRestrictions: false,
      selectedAllergies: [],
      otherAllergies: '',
      selectedMainGoal: 'balanced',
      
      // 界面状态
      loading: false
    };
  },
  computed: {
    // 营养素总和
    macrosTotal() {
      return this.dietForm.proteinPercentage + this.dietForm.carbsPercentage + this.dietForm.fatPercentage;
    },
    
    // 根据目标推荐的食物
    recommendedFoods() {
      const baseRecommendations = [
        {
          category: '蔬果类',
          foods: ['深绿色蔬菜', '红色水果', '橙色蔬果', '浆果类']
        },
        {
          category: '蛋白质来源',
          foods: ['鱼类', '鸡肉', '豆类', '坚果']
        }
      ];
      
      // 根据不同目标添加特定推荐
      if (this.selectedMainGoal === 'weight-management') {
        baseRecommendations.push({
          category: '低热量高饱腹感',
          foods: ['燕麦', '蒸红薯', '藜麦', '鹰嘴豆']
        });
      } 
      else if (this.selectedMainGoal === 'energy') {
        baseRecommendations.push({
          category: '高能量来源',
          foods: ['香蕉', '全麦面包', '红薯', '燕麦']
        });
      }
      else if (this.selectedMainGoal === 'gut-health') {
        baseRecommendations.push({
          category: '益生元食物',
          foods: ['酸奶', '泡菜', '洋葱', '大蒜', '香蕉']
        });
      }
      
      // 素食/纯素调整
      if (this.dietForm.dietType === 'vegetarian' || this.dietForm.dietType === 'vegan') {
        const proteinIndex = baseRecommendations.findIndex(r => r.category === '蛋白质来源');
        if (proteinIndex !== -1) {
          if (this.dietForm.dietType === 'vegetarian') {
            baseRecommendations[proteinIndex].foods = ['豆类', '坚果', '蛋', '奶酪', '豆腐'];
          } else {
            baseRecommendations[proteinIndex].foods = ['豆类', '坚果', '豆腐', '藜麦', '大豆制品'];
          }
        }
      }
      
      return baseRecommendations;
    },
    
    // 建议减少的食物
    foodsToReduce() {
      const baseReductions = [
        {
          category: '加工食品',
          foods: ['精制糖', '精制面粉', '加工肉类']
        }
      ];
      
      if (this.selectedMainGoal === 'weight-management') {
        baseReductions.push({
          category: '高热量食物',
          foods: ['甜点', '油炸食品', '含糖饮料', '酒精']
        });
      }
      else if (this.selectedMainGoal === 'gut-health') {
        baseReductions.push({
          category: '可能刺激肠道',
          foods: ['辛辣食物', '咖啡因', '酒精', '高脂肪食物']
        });
      }
      
      return baseReductions;
    },
    
    // 餐食建议
    mealSuggestions() {
      const suggestions = [];
      
      if (this.selectedMainGoal === 'balanced') {
        suggestions.push(
          { title: '均衡早餐', description: '全麦面包配鸡蛋和蔬菜，搭配一份水果' },
          { title: '营养午餐', description: '糙米饭配烤鱼和蔬菜沙拉' }
        );
      } 
      else if (this.selectedMainGoal === 'weight-management') {
        suggestions.push(
          { title: '低热量早餐', description: '希腊酸奶配浆果和少量坚果' },
          { title: '轻盈午餐', description: '鸡胸肉沙拉配藜麦和蔬菜' }
        );
      }
      else if (this.selectedMainGoal === 'energy') {
        suggestions.push(
          { title: '能量早餐', description: '燕麦粥配香蕉和坚果黄油' },
          { title: '持久能量午餐', description: '全麦三明治配鸡肉、鳄梨和蔬菜' }
        );
      }
      else if (this.selectedMainGoal === 'gut-health') {
        suggestions.push(
          { title: '肠道友好早餐', description: '希腊酸奶配香蕉和少量坚果' },
          { title: '益生菌午餐', description: '烤蔬菜配藜麦和少量泡菜' }
        );
      }
      
      // 晚餐建议对所有目标都适用
      suggestions.push({
        title: '均衡晚餐',
        description: '适量蛋白质(鱼/肉/豆腐)配蔬菜和全谷物'
      });
      
      // 根据餐次调整
      if (this.dietForm.mealsPerDay > 3) {
        suggestions.push({
          title: '健康加餐',
          description: '水果、坚果或酸奶等小份健康零食'
        });
      }
      
      return suggestions;
    }
  },
  methods: {
    // 表单操作
    onDietaryRestrictionsChange(e) {
      this.hasDietaryRestrictions = e.detail.value;
      if (!this.hasDietaryRestrictions) {
        this.selectedAllergies = [];
        this.otherAllergies = '';
        this.dietForm.allergies = [];
      }
    },
    
    onAllergiesChange(e) {
      this.selectedAllergies = e.detail.value;
      this.updateAllergies();
    },
    
    updateAllergies() {
      this.dietForm.allergies = [...this.selectedAllergies];
      if (this.otherAllergies) {
        this.dietForm.allergies.push(this.otherAllergies);
      }
    },
    
    onDietTypeChange(e) {
      this.dietForm.dietType = e.detail.value;
    },
    
    onMealsPerDayChange(e) {
      this.dietForm.mealsPerDay = e.detail.value;
    },
    
    onCaloriesGoalChange(e) {
      this.dietForm.caloriesGoal = e.detail.value;
    },
    
    onProteinChange(e) {
      this.dietForm.proteinPercentage = e.detail.value;
    },
    
    onCarbsChange(e) {
      this.dietForm.carbsPercentage = e.detail.value;
    },
    
    onFatChange(e) {
      this.dietForm.fatPercentage = e.detail.value;
    },
    
    onWaterGoalChange(e) {
      this.dietForm.waterGoal = e.detail.value;
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 保存目标
    async saveGoal() {
      if (this.macrosTotal !== 100) {
        uni.showToast({
          title: '蛋白质、碳水和脂肪比例总和必须为100%',
          icon: 'none'
        });
        return;
      }
      
      if (this.hasDietaryRestrictions && this.selectedAllergies.length === 0 && !this.otherAllergies) {
        uni.showToast({
          title: '请选择或输入食物过敏/忌口',
          icon: 'none'
        });
        return;
      }
      
      try {
        this.loading = true;
        
        // 更新过敏信息
        this.updateAllergies();
        
        // 构造提交的数据
        const goalData = {
          selectedGoals: ['diet'],
          dietGoals: {
            mainGoal: this.selectedMainGoal,
            dietType: this.dietForm.dietType,
            mealsPerDay: this.dietForm.mealsPerDay,
            caloriesGoal: this.dietForm.caloriesGoal,
            macros: {
              protein: this.dietForm.proteinPercentage,
              carbs: this.dietForm.carbsPercentage,
              fat: this.dietForm.fatPercentage
            },
            waterGoal: this.dietForm.waterGoal,
            allergies: this.dietForm.allergies
          }
        };
        
        await setGoals(goalData);
        
        uni.showToast({
          title: '饮食目标设置成功',
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
  transform: scale(1.01);
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

.radio {
  margin-right: 30rpx;
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

.hint-text {
  font-size: 24rpx;
  color: #999;
  margin-top: 6rpx;
  display: block;
}

.macros-total {
  margin-bottom: 30rpx;
  text-align: right;
}

.total-text {
  font-size: 28rpx;
  color: #42b883;
}

.total-text.warning {
  color: #e9692c;
}

/* 饮食建议样式 */
.suggestions-header {
  margin-bottom: 24rpx;
}

.suggestions-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin: 20rpx 0;
  display: block;
}

.food-groups {
  margin-bottom: 30rpx;
}

.food-group {
  margin-bottom: 16rpx;
  padding: 16rpx;
  background-color: #f9f9f9;
  border-radius: 12rpx;
}

.food-group-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.food-group-items {
  font-size: 26rpx;
  color: #666;
}

.meal-suggestions {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.meal-card {
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 12rpx;
}

.meal-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.meal-desc {
  font-size: 26rpx;
  color: #666;
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