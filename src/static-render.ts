import * as path from 'path';
const puppeteer = require('puppeteer');

class StaticRender {
  _routes: string[];
  _delay: number;
  _options: any;
  _puppeteer: any;
  _port: number;
  _isLog: boolean;

  constructor (routes: string[], delay: number, port: number, isLog: boolean) {
    this._routes = routes;
    this._delay = delay;
    this._port = port;
    this._isLog = isLog;
    // default linux
    let executablePath = path.join(__dirname, './chrome-linux/google-chrome-stable_current_x86_64.rpm');
    if (process.platform.toLowerCase() === 'darwin') {
      // Mac os
      executablePath = path.join(__dirname, './chrome-mac/Chromium.app/Contents/MacOS/Chromium');
    }
    this._options = {
      headless: true,
      executablePath,
      renderAfterTime: delay,
    }
  }

  async init () {
    const options = {
      renderAfterTime: this._delay,
      maxConcurrentRoutes: 0,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };
    // mac
    if (process.platform.toLowerCase() === 'darwin') {
      options.args = [];
    }
    this._puppeteer = await puppeteer.launch(options)
  }

  closeFunc() {
    this._puppeteer.close();
  }

  print(msg: string) {
    if (this._isLog) {
      console.log(msg);
    }
  }

  async go () {
    const pagePromises = Promise.all(
      this._routes.map(async (route) => {
          // 新建页面
          const page = await this._puppeteer.newPage();
          // 设置URL
          const url = `http://localhost:${this._port}`;
          // 页面跳转
          await page.goto(`${url}${route}`, { waituntil: 'networkidle0' });

          this.print(`${new Date()}:::${route}页面打开`);

          await page.waitFor(this._delay);

          const result = {
            originalRoute: route,
            route: await page.evaluate('window.location.pathname'),
            html: await page.content()
          };

          this.print(`${new Date()}:::${route}获取页面内容:${result.html}`);

          await page.close();
          return result
        }
      )
    );
    return pagePromises
  }
}

export default StaticRender;
