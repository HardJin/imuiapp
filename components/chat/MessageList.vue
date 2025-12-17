<template>
  <scroll-view
    class="message-list"
    scroll-y
    :scroll-into-view="scrollId"
    scroll-with-animation
    @scrolltoupper="$emit('loadMore')"
    :enable-back-to-top="true"
  >
    <view id="top-anchor"></view>
    <view
      v-for="item in messages"
      :key="item.client_msg_id || item.id"
      class="row"
      :id="domId(item)"
    >
      <view
        class="bubble"
        :class="item.from_user_id === currentUserId ? 'bubble-self' : 'bubble-peer'"
      >
        <view v-if="item.content_type === 'text'">{{ item.content }}</view>
        <view v-else class="placeholder">暂不支持的类型：{{ item.content_type }}</view>
        <view v-if="item.status === 'pending'" class="status">发送中...</view>
        <view v-else-if="item.status === 'failed'" class="status status-error">发送失败</view>
      </view>
    </view>
    <view id="bottom-anchor"></view>
  </scroll-view>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    currentUserId: {
      type: Number,
      default: null
    }
  },
  computed: {
    lastId() {
      if (!this.messages.length) return 'bottom-anchor';
      const last = this.messages[this.messages.length - 1];
      return this.domId(last);
    }
  },
  data() {
    return {
      scrollId: 'bottom-anchor'
    };
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollId = this.lastId;
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    domId(item) {
      return `msg-${item.client_msg_id || item.id || Math.random()}`;
    }
  }
};
</script>

<style scoped lang="scss">
.message-list {
  height: calc(100vh - 240rpx);
  padding: 24rpx;
  box-sizing: border-box;
}
.row {
  display: flex;
  margin-bottom: 12rpx;
}
.bubble {
  max-width: 80%;
  padding: 16rpx 20rpx;
  border-radius: 16rpx;
  line-height: 1.5;
  font-size: 28rpx;
}
.bubble-peer {
  background: #fff;
  border: 1px solid #eee;
  align-self: flex-start;
}
.bubble-self {
  background: #007aff;
  color: #fff;
  margin-left: auto;
}
.placeholder {
  color: #ccc;
}
.status {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #999;
}
.status-error {
  color: #ff4d4f;
}
</style>

