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
    constructor(routes, delay, port) {
        this._routes = routes;
        this._delay = delay;
        this._port = port;
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
            this._puppeteer = yield puppeteer.launch({ renderAfterTime: this._delay, maxConcurrentRoutes: 0 });
        });
    }
    go() {
        return __awaiter(this, void 0, void 0, function* () {
            const pagePromises = Promise.all(this._routes.map((route) => __awaiter(this, void 0, void 0, function* () {
                const page = yield this._puppeteer.newPage();
                const url = `http://localhost:${this._port}`;
                yield page.goto(`${url}${route}`, { waituntil: 'networkidle0' });
                yield page.evaluate(() => {
                    return new Promise((resolve) => {
                        setTimeout(() => resolve(), 5000);
                    });
                });
                const result = {
                    originalRoute: route,
                    route: yield page.evaluate('window.location.pathname'),
                    html: yield page.content()
                };
                yield page.close();
                return result;
            })));
            return pagePromises;
        });
    }
}
exports.default = StaticRender;
//# sourceMappingURL=static-render.js.map