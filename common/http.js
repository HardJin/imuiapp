import { config, storageKeys } from './config';

const handleError = (err) => {
  const message = err?.message || '请求失败';
  uni.showToast({ title: message, icon: 'none' });
};

const request = (options) => {
  const token = uni.getStorageSync(storageKeys.token);
  const headers = options.header || {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${config.baseURL}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: headers,
      timeout: config.timeout,
      success: (res) => {
        const body = res.data || {};
        const code = body.code ?? res.statusCode;
        if (res.statusCode === 401 || code === 401) {
          uni.removeStorageSync(storageKeys.token);
          uni.removeStorageSync(storageKeys.user);
          uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/auth/login' });
          }, 500);
          reject(body);
          return;
        }
        if (code === 0) {
          resolve(body.data);
          return;
        }
        reject(body);
      },
      fail: (err) => {
        reject({ code: -1, message: err.errMsg || '网络异常' });
      }
    });
  }).catch((err) => {
    handleError(err);
    throw err;
  });
};

export default request;

