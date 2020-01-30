import Vue from 'vue'
import App from './App'
import db from './config/datastore'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import bus from './config/bus';
import dayjs from 'dayjs';
import 'element-ui/lib/theme-chalk/index.css';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.prototype.$bus = bus.bus;
Vue.prototype.$event = bus.events;
Vue.prototype.$db = db;
Vue.prototype.$dayjs = dayjs;
Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');
