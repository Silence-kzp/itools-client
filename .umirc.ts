import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { 
      path: '/', 
      component: '@/layouts/index',
      routes: [
        { path: '/', component: '@/pages/index' }
      ],
    },

  ],
  alias: {
    'components': '@/components',
    'utils': '@/utils',
    'assets': '@/assets',
  },
  theme: {
    '@layout-header-height': '58px',
    '@layout-page-width': '1236px',
    '@primary-color': '#18C2C4',
    '@layout-header-background': '#1C2F48',
    '@layout-footer-padding': '0',
    '@layout-header-padding': '0',
  },
  chainWebpack(config: any) { 
    // svg
    config.module.rules.delete('svg'); 
    config.module.rule('svg')
                 .test(/\.svg$/i)
                 .use('@svgr/webpack')
                 .loader('@svgr/webpack');             
  },

});
