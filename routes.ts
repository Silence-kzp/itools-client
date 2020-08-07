export default [
  {
    // 登录页
    path: '/',
    component: '@/pages/index',
    wrappers: ['@/pages/wrappers'],
    exact: true,
  },
  {
    // 机器学习
    path: '/intelligent',
    component: '@/layouts/index',
    wrappers: ['@/pages/wrappers'],
    routes: [
      {
        path: '/intelligent/tts',
        component: '@/pages/intelligent/tts/index',
        exact: true,
      },
    ],
    exact: false,
  },
  {
    // 算法
    path: '/algorithm',
    component: '@/layouts/index',
    wrappers: ['@/pages/wrappers'],
    routes: [
      {
        // 曲线拟合
        path: '/algorithm/fitted_curve',
        component: '@/pages/algorithm/fitted_curve/index',
        exact: true,
      },
    ],
    exact: false,
  },
  {
    // 404
    component: '@/pages/404',
  },
];
