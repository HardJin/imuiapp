<template>
  <view class="container">
    <view class="section">
      <view class="section-title">收到的请求</view>
      <view v-if="!incoming.length" class="empty">暂无</view>
      <view v-for="item in incoming" :key="item.id" class="card request">
        <view class="name">{{ (item.from_user && item.from_user.username) || item.from_user_id }}</view>
        <view class="actions">
          <button size="mini" type="primary" @tap="accept(item.id)">接受</button>
          <button size="mini" type="warn" @tap="reject(item.id)">拒绝</button>
        </view>
      </view>
    </view>

    <view class="section mt-32">
      <view class="section-title">已发送的请求</view>
      <view v-if="!outgoing.length" class="empty">暂无</view>
      <view v-for="item in outgoing" :key="item.id" class="card request">
        <view class="name">{{ (item.to_user && item.to_user.username) || item.to_user_id }}</view>
        <view class="text-sub">待对方处理</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('friends', ['incoming', 'outgoing'])
  },
  onShow() {
    this.load();
  },
  methods: {
    ...mapActions('friends', ['loadRequests', 'handleRequest', 'loadFriends']),
    async load() {
      await this.loadRequests();
    },
    async accept(id) {
      await this.handleRequest({ id, action: 'accept' });
      await this.loadFriends();
      uni.showToast({ title: '已接受', icon: 'success' });
    },
    async reject(id) {
      await this.handleRequest({ id, action: 'reject' });
      uni.showToast({ title: '已拒绝', icon: 'none' });
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 24rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}
.request {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.name {
  font-size: 30rpx;
}
.actions button {
  margin-left: 12rpx;
}
.empty {
  color: #888;
  padding: 16rpx 0;
}
</style>

