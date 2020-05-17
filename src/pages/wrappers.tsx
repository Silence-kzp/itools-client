/**
 *  用于路由级别的权限校验
 */
import React from 'react';
import { useAccess, Redirect } from 'umi';

export default function({ children, route }: any) {
  const access = useAccess();
  if (route.path === '/' && access.role) {
    // 已经登录，并且当前是登录页
    return <Redirect to="/overview" />;
  } else if (route.path !== '/' && !access.role) {
    // 未登录
    return <Redirect to="/" />;
  }
  return <>{children}</>;
}
