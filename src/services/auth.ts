import fetch from 'utils/fetch';

// 登录
export function login(query?: object) {
  return Promise.resolve({ role: 'guest' });
}

// 登出
export function logout() {
  return Promise.resolve();
}

// 用户信息
export function getUserInfo() {
  return Promise.resolve({ role: 'guest' });
}
