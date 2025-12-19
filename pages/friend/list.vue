<template>
  <view class="container">
    <view class="toolbar card">
      <button size="mini" class="btn-primary" @tap="goRequests">好友请求</button>
      <button size="mini" @tap="goSearch">添加好友</button>
      <button size="mini" @tap="goSettings">设置</button>
    </view>

    <view v-if="!friends.length" class="empty">暂无好友，去添加吧～</view>

    <view v-else class="list">
      <view
        v-for="item in friends"
        :key="item.id"
        class="friend-item card"
        @tap="openChat(item)"
      >
        <avatar
          class="avatar"
          :name="item.username"
          :avatar="item.avatar"
        />
        <view class="center">
          <view class="name">{{ item.username }}</view>
          <view class="text-sub">ID: {{ item.id }}</view>
        </view>
        <view v-if="unread(item.id)" class="badge">{{ unread(item.id) }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Avatar from '@/components/common/Avatar.vue';

export default {
  components: { Avatar },
  computed: {
    ...mapState('friends', ['list']),
    ...mapGetters('messages', ['unreadCount']),
    friends() {
      return this.list || [];
    }
  },
  onShow() {
    this.init();
  },
  methods: {
    ...mapActions('friends', ['loadFriends']),
    unread(id) {
      return this.unreadCount(id);
    },
    async init() {
      const authed = this.$store.getters['auth/isAuthed'];
      if (!authed) {
        uni.reLaunch({ url: '/pages/auth/login' });
        return;
      }
      await this.loadFriends();
    },
    goRequests() {
      uni.navigateTo({ url: '/pages/friend/requests' });
    },
    goSearch() {
      uni.navigateTo({ url: '/pages/friend/search' });
    },
    goSettings() {
      uni.navigateTo({ url: '/pages/settings/privacy' });
    },
    openChat(user) {
      uni.navigateTo({
        url: `/pages/chat/session?peerId=${user.id}&name=${encodeURIComponent(user.username)}`
      });
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 24rpx;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list {
  margin-top: 24rpx;
}
.friend-item {
  position: relative;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
}
.avatar {
  margin-right: 20rpx;
}
.center {
  flex: 1;
}
.name {
  font-size: 32rpx;
  font-weight: 600;
}
.badge {
  position: absolute;
  right: 16rpx;
  top: 16rpx;
  min-width: 40rpx;
  padding: 4rpx 12rpx;
  background: #ff4d4f;
  color: #fff;
  border-radius: 24rpx;
  text-align: center;
  font-size: 24rpx;
}
.empty {
  text-align: center;
  color: #888;
  margin-top: 160rpx;
}
</style>


