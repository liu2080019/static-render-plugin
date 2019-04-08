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
const path = require("path");
const puppeteer = require('puppeteer');
class StaticRender {
    constructor(routes, delay, port, isLog) {
        this._routes = routes;
        this._delay = delay;
        this._port = port;
        this._isLog = isLog;
        let executablePath = path.join(__dirname, './chrome-linux/google-chrome-stable_current_x86_64.rpm');
        if (process.platform.toLowerCase() === 'darwin') {
            executablePath = path.join(__dirname, './chrome-mac/Chromium.app/Contents/MacOS/Chromium');
        }
        this._options = {
            headless: true,
            executablePath,
            renderAfterTime: delay,
        };
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                ignoreHTTPSErrors: true,
                renderAfterTime: this._delay,
                maxConcurrentRoutes: 0,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            };
            if (process.platform.toLowerCase() === 'darwin') {
                options.args = [];
            }
            this._puppeteer = yield puppeteer.launch(options);
        });
    }
    closeFunc() {
        this._puppeteer.close();
    }
    print(msg) {
        if (this._isLog) {
            console.log(msg);
        }
    }
    go() {
        return __awaiter(this, void 0, void 0, function* () {
            const pagePromises = Promise.all(this._routes.map((route) => __awaiter(this, void 0, void 0, function* () {
                const page = yield this._puppeteer.newPage();
                page.on('console', (msg) => {
                    if (typeof msg === 'object') {
                        this.print('=========================打印页面日志================================');
                        this.print(JSON.stringify(msg));
                        this.print('=========================打印页面日志end================================');
                    }
                    else {
                        this.print('=========================打印页面日志================================');
                        this.print(msg);
                        this.print('=========================打印页面日志end================================');
                    }
                });
                const url = `http://localhost:${this._port}`;
                yield page.goto(`${url}${route.path}`, { waituntil: 'networkidle0' });
                this.print(`${new Date()}:::${route.path}页面打开`);
                yield page.waitFor(this._delay);
                const result = {
                    name: route.name,
                    route: route.path,
                    html: yield page.content()
                };
                this.print(`${new Date()}:::${route}获取页面内容:${result.html}`);
                yield page.close();
                return result;
            })));
            return pagePromises;
        });
    }
}
exports.default = StaticRender;
//# sourceMappingURL=static-render.js.map