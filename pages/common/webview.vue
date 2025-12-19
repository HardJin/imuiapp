<template>
  <view class="container">
    <web-view :src="src"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      src: ''
    };
  },
  onLoad(options) {
    let url = options.url ? decodeURIComponent(options.url) : '';
    // H5 下将 /static/xx.html 转为绝对地址，避免跨域问题
    // #ifdef H5
    if (url && url.indexOf('http') !== 0 && typeof window !== 'undefined') {
      url = window.location.origin + url;
    }
    // #endif
    this.src = url;
  }
};
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
}
</style>


