// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import ElTreeGrid from 'element-tree-grid'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/css/index.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入myaxios
import myaxios from '../src/assets/js/myaxios'
import App from './App'
import router from './router'
import moment from 'moment'
Vue.use(VueQuillEditor)
Vue.use(ElementUI)
// 使用axios
Vue.use(myaxios)
Vue.component(ElTreeGrid.name, ElTreeGrid)
Vue.prototype.$moment = moment// 赋值使用
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
