import Vue from 'vue'
import store from './store'
import router from './router'
import filters from './filters'
import App from './App.vue'

import 'jquery';
import 'bootstrap';

Vue.config.productionTip = false

// Register filters globally
for (const [filterName, funcBody] of Object.entries(filters)) {
  Vue.filter(filterName, funcBody);
}

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')