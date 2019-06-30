import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'

const Login = () => import('@/components/login/login.vue')
const Home = () => import('../components/home/home.vue')
const UserList = () => import('../components/userList/userList.vue')
const PermList = () => import('../components/Permission/PermList.vue')
const Rights = () => import('../components/rights/rights.vue')
const Reports = () => import('../components/reports/reports.vue')
const Goods = () => import('../components/goods/goods.vue')
const Categories = () => import('../components/categories/categories.vue')
const Addgood = () => import('../components/goods/addgood.vue')
const VueQuillEdito = () => import('../components/vueQuillEdito/vueQuillEdito.vue')

Vue.use(Router)
var router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/users', component: UserList },
        { path: '/roles', component: PermList },
        { path: '/rights', component: Rights },
        { path: '/reports', component: Reports },
        { path: '/goods', component: Goods },
        { path: '/categories', component: Categories },
        { path: '/addGood', component: Addgood },
        { path: '/orders', component: VueQuillEdito }
      ]
    }
  ]
})
router.beforeEach(function (to, from, next) {
  if (to.path !== '/login') {
    let token = window.localStorage.getItem('token')
    if (!token) {
      Message.warning('请先登录')
      router.push('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
