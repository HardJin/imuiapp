<template>
  <view class="avatar" :style="bgStyle">
    <image
      v-if="avatar"
      class="img"
      :src="avatar"
      mode="aspectFill"
    />
    <text v-else class="text">{{ initials }}</text>
  </view>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 80
    }
  },
  computed: {
    initials() {
      if (!this.name) return 'U';
      return this.name.trim().charAt(0).toUpperCase();
    },
    bgStyle() {
      const s = `${this.size}rpx`;
      return {
        width: s,
        height: s
      };
    }
  }
};
</script>

<style scoped lang="scss">
.avatar {
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  align-items: center;
  justify-content: center;
  display: flex;
}
.img {
  width: 100%;
  height: 100%;
}
.text {
  font-size: 32rpx;
  color: #666;
}
</style>


