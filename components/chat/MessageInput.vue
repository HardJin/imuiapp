<template>
  <view class="input-wrap">
    <view class="input-bar">
      <view class="emoji-btn" @tap="toggleEmoji">😀</view>
      <textarea
        class="textarea"
        v-model="content"
        auto-height
        placeholder="输入消息"
        :maxlength="500"
        @confirm="onSend"
      />
      <button class="send-btn" type="primary" @tap="onSend">发送</button>
    </view>
    <view v-if="showEmoji" class="emoji-panel">
      <view
        v-for="emoji in emojis"
        :key="emoji"
        class="emoji-item"
        @tap="appendEmoji(emoji)"
      >
        {{ emoji }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      showEmoji: false,
      emojis: ['😀', '😁', '😂', '🤣', '😊', '😍', '😘', '😎', '🤔', '😢', '😭', '😡', '👍', '🙏', '🎉']
    };
  },
  methods: {
    toggleEmoji() {
      this.showEmoji = !this.showEmoji;
    },
    appendEmoji(emoji) {
      this.content += emoji;
    },
    onSend() {
      const text = this.content.trim();
      if (!text) {
        uni.showToast({ title: '请输入内容', icon: 'none' });
        return;
      }
      this.$emit('send', text);
      this.content = '';
      this.showEmoji = false;
    }
  }
};
</script>

<style scoped lang="scss">
.input-wrap {
  background: #fff;
  border-top: 1px solid #eee;
}
.input-bar {
  display: flex;
  padding: 16rpx;
  background: #fff;
  align-items: flex-end;
}
.emoji-btn {
  width: 60rpx;
  height: 60rpx;
  border: 1px solid #e5e5e5;
  border-radius: 12rpx;
  margin-right: 12rpx;
  text-align: center;
  line-height: 60rpx;
  font-size: 32rpx;
}
.textarea {
  flex: 1;
  min-height: 80rpx;
  max-height: 200rpx;
  border: 1px solid #e5e5e5;
  border-radius: 12rpx;
  padding: 12rpx;
  font-size: 28rpx;
}
.send-btn {
  margin-left: 16rpx;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 28rpx;
  background: #007aff;
  color: #fff;
  border-radius: 12rpx;
}
.emoji-panel {
  display: flex;
  flex-wrap: wrap;
  padding: 12rpx 16rpx;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}
.emoji-item {
  width: 80rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  font-size: 40rpx;
}
</style>

