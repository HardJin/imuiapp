import { storageKeys } from '@/common/config';
import { connect, close } from '@/common/ws';
import { login, register, fetchMe } from '@/api';

const state = () => ({
  token: uni.getStorageSync(storageKeys.token) || '',
  user: uni.getStorageSync(storageKeys.user) || null
});

const getters = {
  isAuthed: (state) => !!state.token
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    if (token) {
      uni.setStorageSync(storageKeys.token, token);
    } else {
      uni.removeStorageSync(storageKeys.token);
    }
  },
  setUser(state, user) {
    state.user = user;
    if (user) {
      uni.setStorageSync(storageKeys.user, user);
    } else {
      uni.removeStorageSync(storageKeys.user);
    }
  },
  clear(state) {
    state.token = '';
    state.user = null;
    uni.removeStorageSync(storageKeys.token);
    uni.removeStorageSync(storageKeys.user);
  }
};

const actions = {
  async login({ commit, dispatch, rootState }, payload) {
    const data = await login(payload);
    commit('setToken', data.access_token);
    await dispatch('fetchMe');
    connect(data.access_token);
    // 登录后同步一次未读消息
    if (rootState.messages) {
      dispatch('messages/syncUnread', null, { root: true });
    }
  },
  async register({ dispatch }, payload) {
    await register(payload);
    await dispatch('login', payload);
  },
  async fetchMe({ commit, state }) {
    if (!state.token) return;
    const user = await fetchMe();
    commit('setUser', user);
  },
  logout({ commit }) {
    commit('clear');
    close();
    uni.reLaunch({ url: '/pages/auth/login' });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};


