import Router from '@koa/router';

const routes = new Router();

routes.post('/login', function(ctx) {
  ctx.body = 'login';
});

export default routes;
