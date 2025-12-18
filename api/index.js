import request from '@/common/http';

export const register = (payload) =>
  request({
    url: '/auth/register',
    method: 'POST',
    data: payload
  });

export const login = ({ username, password }) =>
  request({
    url: '/auth/login',
    method: 'POST',
    data: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });

export const fetchMe = () =>
  request({
    url: '/users/me',
    method: 'GET'
  });

export const searchUsers = (keyword) =>
  request({
    url: `/users/search?keyword=${encodeURIComponent(keyword)}`,
    method: 'GET'
  });

export const sendFriendRequest = (to_user_id) =>
  request({
    url: '/friends/requests',
    method: 'POST',
    data: { to_user_id }
  });

export const fetchFriendRequests = (direction = 'incoming') =>
  request({
    url: `/friends/requests/${direction}`,
    method: 'GET'
  });

export const handleFriendRequest = (id, action) =>
  request({
    url: `/friends/requests/${id}/${action}`,
    method: 'POST'
  });

export const fetchFriends = () =>
  request({
    url: '/friends',
    method: 'GET'
  });

export const sendMessageApi = ({ receiver_id, content, content_type = 'text' }) =>
  request({
    url: '/messages',
    method: 'POST',
    data: { receiver_id, content, content_type }
  });

export const fetchHistory = ({ peer_user_id, limit = 50, before }) => {
  let url = `/messages/history?peer_user_id=${peer_user_id}&limit=${limit}`;
  if (before) {
    url += `&before=${encodeURIComponent(before)}`;
  }
  return request({
    url,
    method: 'GET'
  });
};

export const fetchUnread = () =>
  request({
    url: '/messages/unread',
    method: 'GET'
  });


