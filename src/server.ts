import * as Koa from 'koa';
import * as views from 'koa-views';
import * as path from 'path';
import * as fs from 'fs';
import * as koaStatic from 'koa-static';
import * as KoaRouter from 'koa-router';

class Server {
  // 路径
  _resource: any;
  _port: number;
  _server: any;

  constructor (resource: any, port: number) {
    this._resource = resource;
    this._port = port;
  }

  async init () {
    const app = new Koa();
    const koaRouter = new KoaRouter();
    koaRouter.get('/', async (ctx: any) => {
      await ctx.render(path.join(this._resource, 'index.html'));
    });
    koaRouter.get('*', async ctx => {
      ctx.type = 'html';
      ctx.body = fs.createReadStream(path.join(this._resource, 'index.html'));
    });
    app.use(views(this._resource, {
      extension: 'html'
    }));
    app.use(koaStatic(this._resource));
    app.use(koaRouter.routes());
    this._server = app.listen(this._port);
  }

  closeFunc() {
    this._server.close();
  }
}

export default Server;
