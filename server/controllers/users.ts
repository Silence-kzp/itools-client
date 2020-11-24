import Router from '@koa/router';

const routes = new Router();

routes.get('/', function(ctx) {
  ctx.body = 'get users';
});

export default routes;
