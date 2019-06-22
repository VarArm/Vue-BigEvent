import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '../components/home/home.vue'
import UserList from '../components/userList/userList.vue'
import PermList from '../components/Permission/PermList.vue'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/user', component: UserList },
        { path: '/permList', component: PermList }
      ]
    }
  ]
})
