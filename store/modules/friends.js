import { fetchFriends, fetchFriendRequests, sendFriendRequest, handleFriendRequest } from '@/api';

const state = () => ({
  list: [],
  incoming: [],
  outgoing: [],
  loading: false
});

const mutations = {
  setList(state, list) {
    state.list = list || [];
  },
  setIncoming(state, list) {
    state.incoming = list || [];
  },
  setOutgoing(state, list) {
    state.outgoing = list || [];
  },
  setLoading(state, val) {
    state.loading = val;
  }
};

const actions = {
  async loadFriends({ commit }) {
    commit('setLoading', true);
    try {
      const list = await fetchFriends();
      commit('setList', list);
    } finally {
      commit('setLoading', false);
    }
  },
  async loadRequests({ commit }) {
    const incoming = await fetchFriendRequests('incoming');
    const outgoing = await fetchFriendRequests('outgoing');
    commit('setIncoming', incoming);
    commit('setOutgoing', outgoing);
  },
  async sendRequest(_, toUserId) {
    await sendFriendRequest(toUserId);
    uni.showToast({ title: '请求已发送', icon: 'success' });
  },
  async handleRequest({ dispatch }, { id, action }) {
    await handleFriendRequest(id, action);
    await dispatch('loadRequests');
    if (action === 'accept') {
      await dispatch('loadFriends');
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};


