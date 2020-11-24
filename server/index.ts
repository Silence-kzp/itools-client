import { readdirSync } from 'fs';
import { join, extname } from 'path';
import jwt from 'jsonwebtoken';

import Koa from 'koa';
import Jwt from 'koa-jwt';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

// 401错误
app.use(function(ctx, next) {
  next().catch(function(err) {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});

// 路由鉴权
app.use(
  Jwt({
    secret: 'sercret',
    isRevoked: async function(ctx, dtoken, token) {
      let pass = true;
      try {
        pass = !jwt.verify(token, 'sercret');
      } catch (err) {
        console.log(err);
      }
      return pass;
    },
  }).unless({
    path: [/^\/login/],
  }),
);

// 获取controllers下的路由
const base = join(__dirname, '/controllers');
const files = readdirSync(base);
for (let i = 0, len = files.length; i < len; i += 1) {
  const file = files[i];
  if (extname(files[i]) !== '.ts') continue;
  const filename = file.substring(0, file.length - 3);
  const context = require(join(base, file)).default;
  router.use(`/${filename}`, context.routes(), context.allowedMethods());
}

// 引入中间件
app.use(router.routes());
app.use(router.allowedMethods());

app.listen('8080');
