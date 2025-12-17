const BASE_URL = 'http://192.168.88.23:8000';
const WS_URL = 'ws://192.168.88.23:8000/ws/chat';

export const config = {
  baseURL: BASE_URL,
  wsURL: WS_URL,
  timeout: 15000
};

export const storageKeys = {
  token: 'im_token',
  user: 'im_user'
};

