import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const HomeView = () => import('../views/HomeView.vue')
const ArticleView = () => import('../views/ArticleView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const EditorView = () => import('../views/EditorView.vue')
const UserCenterView = () => import('../views/UserCenterView.vue')

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/article/:id', name: 'article', component: ArticleView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/editor/:id?', name: 'editor', component: EditorView, meta: { auth: true } },
  { path: '/me', name: 'me', component: UserCenterView, meta: { auth: true } }
]

const router = createRouter({ history: createWebHistory(), routes })
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.isLoggedIn) return '/login'
})
export default router
