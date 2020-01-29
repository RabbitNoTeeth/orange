import Vue from 'vue'
import App from './App'
import Storage from 'vue-ls'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import bus from './config/bus';
import 'element-ui/lib/theme-chalk/index.css';


if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.prototype.$bus = bus.bus;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Storage, {
    namespace: 'orange_',
    name: 'ls',
    storage: 'local'
});

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');
