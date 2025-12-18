import { config, storageKeys } from './config';

let storeRef = null;
let socketTask = null;
let reconnectTimer = null;
let manualClose = false;

export const setupWS = (store) => {
  storeRef = store;
};

const clearReconnect = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

const scheduleReconnect = () => {
  clearReconnect();
  if (manualClose) return;
  reconnectTimer = setTimeout(() => {
    const token = uni.getStorageSync(storageKeys.token);
    if (token) connect(token);
  }, 3000);
};

export const connect = (token) => {
  if (!token || !storeRef) return;
  if (socketTask) {
    socketTask.close();
    socketTask = null;
  }
  manualClose = false;
  socketTask = uni.connectSocket({
    url: `${config.wsURL}?token=${token}`,
    complete: () => {}
  });

  socketTask.onOpen(() => {
    storeRef.commit('messages/setWsStatus', 'open');
  });

  socketTask.onMessage((res) => {
    try {
      const data = JSON.parse(res.data);
      if (data.type === 'message') {
        storeRef.dispatch('messages/receiveIncoming', data);
      } else if (data.type === 'error') {
        uni.showToast({ title: data.message || 'WS错误', icon: 'none' });
      }
    } catch (e) {
      console.warn('WS parse error', e);
    }
  });

  socketTask.onClose(() => {
    storeRef.commit('messages/setWsStatus', 'closed');
    scheduleReconnect();
  });

  socketTask.onError(() => {
    storeRef.commit('messages/setWsStatus', 'error');
    scheduleReconnect();
  });
};

export const sendMessage = (payload) => {
  if (!socketTask) {
    uni.showToast({ title: '连接中，稍后再试', icon: 'none' });
    return;
  }
  socketTask.send({
    data: JSON.stringify(payload)
  });
};

export const close = () => {
  manualClose = true;
  clearReconnect();
  if (socketTask) {
    socketTask.close();
    socketTask = null;
  }
};


