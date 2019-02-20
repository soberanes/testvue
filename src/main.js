// Environment configuration
if (process.env.NODE_ENV === 'production') {
  window.endpoint = 'https://kitsherpa.herokuapp.com';
} else {
  window.endpoint = 'http://localhost:3000';
}

// Global variables
window.moment = require('moment');
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Vue from 'vue'
import VuewRouter from 'vue-router'
import App from './components/App.vue'
import Product from './components/Product.vue'
import Order from './components/Order.vue'
import Complete from './components/Complete.vue'
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// Register routes
const routes = [
  {name: 'home', path: '/', component: Product},
  {name: 'order', path: '/order', component: Order},
  {name: 'order-complete', path: '/order-complete/:id', component: Complete}
];

const router = new VueRouter({
  mode: 'hash',
  routes
});

// Instantiate applicacion to the DOM
new Vue({
  router,
  el: '#app',
  data(){
    return {};
  },
  render: h => h(App)
});
