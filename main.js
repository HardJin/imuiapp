import Vue from 'vue';
import App from './App';
import store from './store';
import { setupWS, connect } from './common/ws';

Vue.config.productionTip = false;

setupWS(store);

const cachedToken = store.state.auth.token;
if (cachedToken) {
  connect(cachedToken);
}

App.mpType = 'app';

const app = new Vue({
  store,
  ...App
});
app.$mount();

