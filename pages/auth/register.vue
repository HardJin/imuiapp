<template>
  <view class="container">
    <view class="title">创建账号</view>
    <view class="card mt-24">
      <view class="field">
        <text class="label">用户名</text>
        <input class="input" v-model="form.username" placeholder="请输入用户名" />
      </view>
      <view class="field mt-24">
        <text class="label">密码</text>
        <input class="input" v-model="form.password" password placeholder="请输入密码" />
      </view>
      <button class="btn mt-32" type="primary" @tap="handleRegister">注册</button>
      <view class="text-sub mt-16">
        已有账号？
        <text class="link" @tap="goLogin">去登录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false
    };
  },
  methods: {
    ...mapActions('auth', ['register']),
    async handleRegister() {
      if (!this.form.username || !this.form.password) {
        uni.showToast({ title: '请填写完整', icon: 'none' });
        return;
      }
      this.loading = true;
      try {
        await this.register(this.form);
        uni.showToast({ title: '注册并登录成功', icon: 'success' });
        uni.reLaunch({ url: '/pages/friend/list' });
      } finally {
        this.loading = false;
      }
    },
    goLogin() {
      uni.navigateBack({ delta: 1 });
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 48rpx 32rpx;
}
.title {
  font-size: 44rpx;
  font-weight: 700;
  color: #111;
}
.field .label {
  color: #666;
  font-size: 26rpx;
  margin-bottom: 12rpx;
  display: block;
}
.input {
  height: 88rpx;
  border: 1px solid #e5e5e5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  background: #fafafa;
}
.btn {
  height: 88rpx;
  line-height: 88rpx;
  background: #007aff;
  color: #fff;
  border-radius: 12rpx;
}
.link {
  color: #007aff;
}
</style>

