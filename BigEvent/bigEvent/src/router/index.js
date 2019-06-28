import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '../components/home/home.vue'
import UserList from '../components/userList/userList.vue'
import PermList from '../components/Permission/PermList.vue'
import Rights from '../components/rights/rights.vue'
import Reports from '../components/reports/reports.vue'
import Goods from '../components/goods/goods.vue'
import Categories from '../components/categories/categories.vue'
import Addgood from '../components/goods/addgood.vue'
import VueQuillEdito from '../components/vueQuillEdito/vueQuillEdito.vue'
import { Message } from 'element-ui'

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
