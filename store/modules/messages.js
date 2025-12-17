import Vue from 'vue';
import { fetchHistory, fetchUnread, sendMessageApi } from '@/api';
import { sendMessage as sendMessageWS } from '@/common/ws';

const state = () => ({
  sessions: {},
  unread: {},
  activePeerId: null,
  wsStatus: 'closed'
});

const getters = {
  sessionMessages: (state) => (peerId) => {
    const session = state.sessions[peerId];
    return session ? session.list : [];
  },
  unreadCount: (state) => (peerId) => state.unread[peerId] || 0
};

const ensureSession = (state, peerId) => {
  if (!state.sessions[peerId]) {
    Vue.set(state.sessions, peerId, {
      list: [],
      hasMore: true,
      loading: false
    });
  }
};

const mutations = {
  setWsStatus(state, status) {
    state.wsStatus = status;
  },
  setActivePeerId(state, peerId) {
    state.activePeerId = peerId;
    if (peerId) {
      Vue.set(state.unread, peerId, 0);
    }
  },
  setUnreadList(state, unreadArr = []) {
    const map = {};
    unreadArr.forEach((item) => {
      map[item.peer_user_id] = item.unread_count;
    });
    state.unread = map;
  },
  setUnread(state, { peerId, count }) {
    Vue.set(state.unread, peerId, count);
  },
  setSessionLoading(state, { peerId, loading }) {
    ensureSession(state, peerId);
    state.sessions[peerId].loading = loading;
  },
  prependHistory(state, { peerId, messages = [], hasMore = true }) {
    ensureSession(state, peerId);
    const session = state.sessions[peerId];
    const normalized = messages
      .slice()
      .reverse()
      .map((m) => normalizeMessage(m));
    session.list = [...normalized, ...session.list];
    session.hasMore = hasMore;
  },
  addOrUpdateMessage(state, { peerId, message }) {
    ensureSession(state, peerId);
    const session = state.sessions[peerId];
    const idx = session.list.findIndex(
      (m) =>
        (message.client_msg_id && m.client_msg_id === message.client_msg_id) ||
        (message.id && m.id === message.id)
    );
    const normalized = normalizeMessage(message);
    if (idx >= 0) {
      Vue.set(session.list, idx, { ...session.list[idx], ...normalized });
    } else {
      session.list.push(normalized);
    }
  }
};

const normalizeMessage = (msg) => ({
  id: msg.message_id || msg.id || null,
  from_user_id: msg.from_user_id,
  to_user_id: msg.to_user_id,
  content: msg.content,
  content_type: msg.content_type || 'text',
  created_at: msg.created_at || new Date().toISOString(),
  client_msg_id: msg.client_msg_id,
  status: msg.status || 'sent'
});

const actions = {
  async syncUnread({ commit }) {
    const unread = await fetchUnread();
    commit('setUnreadList', unread);
  },
  async loadHistory({ commit }, { peerId, before, limit = 20 }) {
    commit('setSessionLoading', { peerId, loading: true });
    try {
      const data = await fetchHistory({ peer_user_id: peerId, limit, before });
      const hasMore = data.length >= limit;
      commit('prependHistory', { peerId, messages: data, hasMore });
    } finally {
      commit('setSessionLoading', { peerId, loading: false });
    }
  },
  async sendMessage({ commit, rootState, state }, { peerId, content }) {
    const client_msg_id = `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const currentUserId = rootState.auth.user?.id;
    const localMsg = {
      client_msg_id,
      from_user_id: currentUserId,
      to_user_id: peerId,
      content,
      content_type: 'text',
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    commit('addOrUpdateMessage', { peerId, message: localMsg });
    const useWs = state.wsStatus === 'open';
    if (useWs) {
      try {
        sendMessageWS({
          to: peerId,
          content,
          client_msg_id
        });
      } catch (e) {
        commit('addOrUpdateMessage', {
          peerId,
          message: { ...localMsg, status: 'failed' }
        });
        throw e;
      }
    } else {
      try {
        const res = await sendMessageApi({
          receiver_id: peerId,
          content
        });
        commit('addOrUpdateMessage', {
          peerId,
          message: { ...res, client_msg_id, status: 'sent' }
        });
      } catch (e) {
        commit('addOrUpdateMessage', {
          peerId,
          message: { ...localMsg, status: 'failed' }
        });
        throw e;
      }
    }
  },
  receiveIncoming({ commit, rootState, state }, msg) {
    const selfId = rootState.auth.user?.id;
    if (!selfId) return;
    const peerId = msg.from_user_id === selfId ? msg.to_user_id : msg.from_user_id;
    commit('addOrUpdateMessage', { peerId, message: { ...msg, status: 'sent' } });
    if (state.activePeerId !== peerId) {
      commit('setUnread', {
        peerId,
        count: (state.unread[peerId] || 0) + (msg.from_user_id === selfId ? 0 : 1)
      });
    }
  },
  clearUnread({ commit }, peerId) {
    if (!peerId) return;
    commit('setUnread', { peerId, count: 0 });
  },
  setActivePeer({ commit }, peerId) {
    commit('setActivePeerId', peerId);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

