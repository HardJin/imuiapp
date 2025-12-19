export const withAlbumPermission = (fn) => {
  uni.showModal({
    title: '相册权限说明',
    content: '需要访问您的相册以选择图片发送给好友，拒绝仅影响图片发送功能，其他功能不受影响。',
    confirmText: '继续并授权',
    cancelText: '暂不授权',
    success(res) {
      if (res.confirm && typeof fn === 'function') {
        fn();
      }
    }
  });
};

export const withCameraPermission = (fn) => {
  uni.showModal({
    title: '相机权限说明',
    content: '需要使用您的相机拍摄照片发送给好友，拒绝仅影响拍照发送功能。',
    confirmText: '继续并授权',
    cancelText: '暂不授权',
    success(res) {
      if (res.confirm && typeof fn === 'function') {
        fn();
      }
    }
  });
};


