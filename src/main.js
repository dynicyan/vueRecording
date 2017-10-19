import Vue from 'vue'
// import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource'
// import { sync } from 'vuex-router-sync'
// import VueRouter from 'vue-router'
import App from './App'
import './js/recorder.js'
import './assets/base.css'
// const routers = new VueRouter()
// routers.beforeEach(function (to, from, next) {
//   console.log(to, from, next)
// })
Vue.use(VueResource)
Vue.use(ElementUI)
// sync(store, router)
// sync(router)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
