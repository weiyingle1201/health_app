import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ExerciseView from '../views/ExerciseView.vue'
import AddExerciseGoalView from '../views/AddExerciseGoalView.vue'
import DietView from '../views/DietView.vue'
import MentalHealthView from '../views/MentalHealthView.vue'
import ProgressView from '../views/ProgressView.vue'
import AchievementsView from '../views/AchievementsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/exercise',
      name: 'exercise',
      component: ExerciseView,
      meta: { requiresAuth: true }
    },
    {
      path: '/exercise/add-goal',
      name: 'add-exercise-goal',
      component: AddExerciseGoalView,
      meta: { requiresAuth: true }
    },
    {
      path: '/diet',
      name: 'diet',
      component: DietView,
      meta: { requiresAuth: true }
    },
    {
      path: '/mental',
      name: 'mental',
      component: MentalHealthView,
      meta: { requiresAuth: true }
    },
    {
      path: '/progress',
      name: 'progress',
      component: ProgressView,
      meta: { requiresAuth: true }
    },
    {
      path: '/achievements',
      name: 'achievements',
      component: AchievementsView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
    }
})

export default router 