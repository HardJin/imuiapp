<template>
  <view class="container">
    <view v-if="!sessionList.length" class="empty">暂无会话</view>
    <view v-else class="list">
      <view
        v-for="item in sessionList"
        :key="item.peerId"
        class="session card"
        @tap="openChat(item)"
      >
        <avatar
          class="avatar"
          :name="item.name"
          :avatar="item.avatar"
          :size="80"
        />
        <view class="center">
          <view class="top-row">
            <text class="name">{{ item.name }}</text>
            <text class="time">{{ item.time }}</text>
          </view>
          <view class="bottom-row">
            <text class="preview">{{ item.preview }}</text>
            <view v-if="item.unread" class="badge">{{ item.unread }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Avatar from '@/components/common/Avatar.vue';

export default {
  components: { Avatar },
  computed: {
    ...mapState('messages', ['sessions', 'unread']),
    ...mapState('friends', ['list']),
    ...mapState('auth', ['user']),
    ...mapGetters('messages', ['unreadCount']),
    sessionList() {
      const keys = Object.keys(this.sessions || {});
      const friendsMap = {};
      (this.list || []).forEach((f) => {
        friendsMap[f.id] = f;
      });
      const result = keys.map((peerIdStr) => {
        const peerId = Number(peerIdStr);
        const session = this.sessions[peerId];
        const last = session.list[session.list.length - 1];
        if (!last) return null;
        const friend = friendsMap[peerId] || {};
        const name = friend.username || `用户${peerId}`;
        const avatar = friend.avatar || '';
        return {
          peerId,
          name,
          avatar,
          preview: last.content,
          time: last.created_at.slice(0, 16).replace('T', ' '),
          unread: this.unreadCount(peerId)
        };
      });
      return result.filter(Boolean).sort((a, b) => (a.time < b.time ? 1 : -1));
    }
  },
  onShow() {
    // 列表展示前刷新好友列表，保证名称与头像同步
    this.$store.dispatch('friends/loadFriends');
  },
  methods: {
    openChat(item) {
      uni.navigateTo({
        url: `/pages/chat/session?peerId=${item.peerId}&name=${encodeURIComponent(item.name)}`
      });
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 24rpx;
}
.list {
  margin-top: 8rpx;
}
.session {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}
.avatar {
  margin-right: 20rpx;
}
.center {
  flex: 1;
}
.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.name {
  font-size: 32rpx;
  font-weight: 600;
}
.time {
  font-size: 24rpx;
  color: #999;
}
.bottom-row {
  margin-top: 8rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.preview {
  flex: 1;
  font-size: 26rpx;
  color: #666;
  margin-right: 12rpx;
}
.badge {
  min-width: 40rpx;
  padding: 4rpx 10rpx;
  background: #ff4d4f;
  color: #fff;
  border-radius: 24rpx;
  font-size: 22rpx;
  text-align: center;
}
.empty {
  text-align: center;
  color: #888;
  margin-top: 160rpx;
}
</style>


