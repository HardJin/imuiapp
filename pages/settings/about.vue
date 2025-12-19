<template>
  <view class="container">
    <view class="card item" @tap="open('/static/privacy.html')">
      <text>隐私政策</text>
    </view>
    <view class="card item" @tap="open('/static/terms.html')">
      <text>用户协议</text>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    open(path) {
      uni.navigateTo({
        url: `/pages/common/webview?url=${encodeURIComponent(path)}`
      });
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 24rpx;
}
.item {
  margin-bottom: 16rpx;
}
</style>


