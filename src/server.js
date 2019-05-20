"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const views = require("koa-views");
const path = require("path");
const fs = require("fs");
const koaStatic = require("koa-static");
const KoaRouter = require("koa-router");
class Server {
    constructor(resource, port) {
        this._resource = resource;
        this._port = port;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const app = new Koa();
            const koaRouter = new KoaRouter();
            koaRouter.get('/', (ctx) => __awaiter(this, void 0, void 0, function* () {
                yield ctx.render(path.join(this._resource, 'index.html'));
            }));
            koaRouter.get('*', (ctx) => __awaiter(this, void 0, void 0, function* () {
                ctx.type = 'html';
                ctx.body = fs.createReadStream(path.join(this._resource, 'index.html'));
            }));
            app.use(views(this._resource, {
                extension: 'html'
            }));
            app.use(koaStatic(this._resource));
            app.use(koaRouter.routes());
            this._server = app.listen(this._port);
        });
    }
    closeFunc() {
        this._server.close();
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map