export default [
  {
    path: '/',
    component: '@/pages/index',
    wrappers: ['@/pages/wrappers'],
    exact: true,
  },
  {
    path: '/',
    component: '@/layouts/index',
    wrappers: ['@/pages/wrappers'],
    routes: [{ path: 'tts', component: '@/pages/tts/index' }],
  },
];
