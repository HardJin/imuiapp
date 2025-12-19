<template>
  <view class="container">
    <view class="card item" @tap="open('/static/pi-list.html')">
      <text>个人信息收集和使用清单</text>
    </view>
    <view class="card item" @tap="open('/static/third-parties.html')">
      <text>第三方共享清单</text>
    </view>
    <view class="card item" @tap="contact">
      <text>联系客服</text>
    </view>
    <view class="card item danger" @tap="confirmDelete">
      <text>申请注销账号</text>
    </view>
  </view>
</template>

<script>
import request from '@/common/http';

export default {
  methods: {
    open(path) {
      uni.navigateTo({
        url: `/pages/common/webview?url=${encodeURIComponent(path)}`
      });
    },
    contact() {
      uni.showModal({
        title: '联系客服',
        content: '邮箱：example@your.com',
        showCancel: false
      });
    },
    confirmDelete() {
      uni.showModal({
        title: '确认注销',
        content: '注销后账号及相关数据将被处理，操作不可恢复，确定继续？',
        success: async (res) => {
          if (res.confirm) {
            try {
              // 需后端提供对应接口，如 /users/delete
              await request({ url: '/users/delete', method: 'POST' });
              uni.showToast({ title: '已提交注销', icon: 'success' });
              this.$store.dispatch('auth/logout');
            } catch (e) {
              // 错误提示在 http 封装中已处理
            }
          }
        }
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
.danger {
  color: #ff4d4f;
}
</style>


