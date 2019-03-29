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
const static_render_1 = require("./src/static-render");
const server_1 = require("./src/server");
const deal_file_1 = require("./src/deal-file");
const mkdirp = require('mkdirp-promise');
const { minify } = require('html-minifier');
const PORT = 6789;
function PreRenderPlugin(args) {
    this._server = new server_1.default(args.resource, PORT);
    this._staticRender = new static_render_1.default(args.routes, args.delay, PORT);
    this._dealFile = new deal_file_1.default(args.resource);
}
PreRenderPlugin.prototype.apply = function (compiler) {
    compiler.plugin('after-emit', (compilation, done) => __awaiter(this, void 0, void 0, function* () {
        yield this._server.init();
        yield this._staticRender.init();
        const res = yield this._staticRender.go();
        yield this._dealFile.createHtml(res);
    }));
};
module.exports = PreRenderPlugin;
//# sourceMappingURL=index.js.map