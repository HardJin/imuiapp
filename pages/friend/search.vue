<template>
  <view class="container">
    <view class="card">
      <view class="field">
        <input class="input" v-model="keyword" placeholder="输入用户名关键字" />
      </view>
      <button class="btn mt-16" type="primary" @tap="doSearch">搜索</button>
    </view>

    <view class="list mt-24" v-if="results.length">
      <view v-for="item in results" :key="item.id" class="card result">
        <view>
          <view class="name">{{ item.username }}</view>
          <view class="text-sub">ID: {{ item.id }}</view>
        </view>
        <button size="mini" type="primary" @tap="addFriend(item.id)">加好友</button>
      </view>
    </view>
    <view v-else class="empty">暂无结果</view>
  </view>
</template>

<script>
import { searchUsers } from '@/api';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      keyword: '',
      results: []
    };
  },
  methods: {
    ...mapActions('friends', ['sendRequest']),
    async doSearch() {
      if (!this.keyword.trim()) {
        uni.showToast({ title: '请输入关键字', icon: 'none' });
        return;
      }
      this.results = await searchUsers(this.keyword.trim());
    },
    async addFriend(id) {
      await this.sendRequest(id);
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 24rpx;
}
.input {
  height: 80rpx;
  border: 1px solid #e5e5e5;
  border-radius: 12rpx;
  padding: 0 20rpx;
}
.btn {
  height: 80rpx;
  line-height: 80rpx;
  background: #007aff;
  color: #fff;
  border-radius: 12rpx;
}
.result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.name {
  font-size: 30rpx;
  font-weight: 600;
}
.empty {
  text-align: center;
  color: #888;
  margin-top: 160rpx;
}
</style>

