import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  title: 'iTools',
  routes,
  nodeModulesTransform: {
    type: 'none',
  },
  cssLoader: {
    modules: false,
  },
  alias: {
    components: '@/components',
    utils: '@/utils',
    assets: '@/assets',
    services: '@/services',
  },
  theme: {
    '@layout-header-height': '58px',
    '@layout-page-width': '1236px',
    '@primary-color': '#18C2C4',
    '@layout-header-background': '#1C2F48',
    '@layout-footer-padding': '0',
    '@layout-header-padding': '0',
  },
  chunks: ['vendor', 'itools'],
  chainWebpack(config: any) {
    // 移除umi
    const entry = config
      .entry('umi')
      ['store'].values()
      .next().value;
    config.entryPoints.delete('umi');
    config
      .entry('itools')
      .add(entry)
      .end();
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /node_modules/,
              name: 'vendor',
              priority: 10,
              enforce: true,
            },
          },
        },
      },
    });
    // config.optimization.clear();

    // svg
    config.module.rules.delete('svg');
    config.module
      .rule('svg')
      .test(/\.svg$/i)
      .use('@svgr/webpack')
      .loader('@svgr/webpack');
  },
});
