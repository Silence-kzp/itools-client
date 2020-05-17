import { useCallback } from 'react';
import { login, logout } from 'services/auth';
import { useModel } from 'umi';

export default function useAuthModel() {
  const { setInitialState } = useModel('@@initialState');
  // 登录
  const _login = useCallback(function(query?: object) {
    return login(query).then(function(u) {
      setInitialState({ user: u });
      return Promise.resolve(u);
    });
  }, []);
  // 退出登录
  const _logout = useCallback(function() {
    return logout().then(function() {
      setInitialState({ user: null });
      return Promise.resolve();
    });
  }, []);

  return {
    login: _login,
    logout: _logout,
  };
}
