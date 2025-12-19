<template>
  <view class="container">
    <view class="card header">
      <avatar
        :name="user && user.username"
        :avatar="user && user.avatar"
        :size="120"
      />
      <view class="info">
        <view class="name">{{ user && user.username }}</view>
        <view class="text-sub">ID: {{ user && user.id }}</view>
      </view>
    </view>

    <view class="card item" @tap="open('/pages/settings/about')">
      <text>关于与协议</text>
    </view>
    <view class="card item" @tap="open('/pages/settings/privacy')">
      <text>隐私中心</text>
    </view>
    <view class="card item danger" @tap="logout">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Avatar from '@/components/common/Avatar.vue';

export default {
  components: { Avatar },
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    open(url) {
      uni.navigateTo({ url });
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 24rpx;
}
.header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}
.info {
  margin-left: 24rpx;
}
.name {
  font-size: 34rpx;
  font-weight: 600;
}
.item {
  margin-bottom: 16rpx;
}
.danger {
  color: #ff4d4f;
}
</style>


