<template>
  <view class="chat-page">
    <message-list
      :messages="messages"
      :currentUserId="selfId"
      @loadMore="loadMore"
    />
    <message-input @send="send" />
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import MessageList from '@/components/chat/MessageList.vue';
import MessageInput from '@/components/chat/MessageInput.vue';

export default {
  components: { MessageList, MessageInput },
  data() {
    return {
      peerId: null,
      peerName: ''
    };
  },
  computed: {
    ...mapState('messages', ['sessions']),
    ...mapState('auth', ['user']),
    session() {
      return this.sessions[this.peerId] || { list: [], hasMore: true, loading: false };
    },
    messages() {
      return this.session.list;
    },
    selfId() {
      if (!this.user) return null;
      return this.user.id || this.user.user_id;
    }
  },
  onLoad(options) {
    this.peerId = Number(options.peerId || options.peer_id);
    this.peerName = options.name ? decodeURIComponent(options.name) : '';
    if (this.peerName) {
      uni.setNavigationBarTitle({ title: this.peerName });
    }
  },
  async onShow() {
    await this.enter();
  },
  onUnload() {
    this.setActivePeer(null);
  },
  methods: {
    ...mapActions('messages', [
      'loadHistory',
      'sendMessage',
      'setActivePeer',
      'clearUnread'
    ]),
    async enter() {
      if (!this.peerId) {
        uni.showToast({ title: '缺少会话', icon: 'none' });
        uni.navigateBack();
        return;
      }
      await this.setActivePeer(this.peerId);
      await this.clearUnread(this.peerId);
      if (!this.messages.length) {
        await this.loadHistory({ peerId: this.peerId, limit: 20 });
      }
    },
    async loadMore() {
      if (this.session.loading || !this.session.hasMore || !this.messages.length) return;
      const first = this.messages[0];
      await this.loadHistory({ peerId: this.peerId, before: first.created_at, limit: 20 });
    },
    async send(text) {
      await this.sendMessage({ peerId: this.peerId, content: text });
    }
  }
};
</script>

<style scoped lang="scss">
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}
</style>

