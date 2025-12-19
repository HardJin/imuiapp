<script>
const PRIVACY_VERSION = '1.0';

export default {
  onLaunch() {
    console.log('App Launch');
    const agreed = uni.getStorageSync('privacy_agreed_version');
    if (agreed !== PRIVACY_VERSION) {
      uni.showModal({
        title: '隐私政策提示',
        content:
          '我们会根据隐私政策收集和使用必要信息以提供即时通讯服务，请您阅读并同意《隐私政策》和《用户协议》。',
        confirmText: '同意并继续',
        cancelText: '不同意',
        success: (res) => {
          if (res.confirm) {
            uni.setStorageSync('privacy_agreed_version', PRIVACY_VERSION);
          } else {
            // 用户拒绝，限制使用
            // #ifdef APP-PLUS
            plus.runtime.quit();
            // #endif
            // #ifdef H5
            uni.showToast({ title: '您已拒绝隐私政策，本应用将无法使用', icon: 'none' });
            // #endif
          }
        }
      });
    }
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  }
};
</script>

<style lang="scss">
@import "./uni.scss";

page {
  background: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

.btn-primary {
  background: #007aff;
  color: #fff;
}

.card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
}
</style>


