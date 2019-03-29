import * as Koa from 'koa';
import * as views from 'koa-views';
import * as path from 'path';
import * as koaStatic from 'koa-static';
import * as KoaRouter from 'koa-router';

class Server {
  // 路径
  _resource: any;
  _port: number;

  constructor (resource: any, port: number) {
    this._resource = resource;
    this._port = port;
  }

  async initialize () {
    const app = new Koa();
    const koaRouter = new KoaRouter();
    koaRouter.get('/', async (ctx: any) => {
      await ctx.render(path.join(this._resource, 'index.html'));
    });
    app.use(views(this._resource, {
      extension: 'html'
    }));
    app.use(koaStatic(this._resource));
    app.use(koaRouter.routes());
    app.listen(this._port);
  }

  destroy () {

  }
}

export default Server;
