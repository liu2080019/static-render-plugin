import * as path from 'path';
const puppeteer = require('puppeteer');

class StaticRender {
  _routes: string[];
  _delay: number;
  _options: any;
  _puppeteer: any;
  _port: number;

  constructor (routes: string[], delay: number, port: number) {
    this._routes = routes;
    this._delay = delay;
    this._port = port;
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

  async go () {
    const pagePromises = Promise.all(
      this._routes.map(async (route) => {
          // 新建页面
          const page = await this._puppeteer.newPage();
          // 设置URL
          const url = `http://localhost:${this._port}`;
          // 页面跳转
          await page.goto(`${url}${route}`, { waituntil: 'networkidle0' });

          await page.waitFor(this._delay);

          const result = {
            originalRoute: route,
            route: await page.evaluate('window.location.pathname'),
            html: await page.content()
          };
          await page.close();
          return result
        }
      )
    );
    return pagePromises
  }
}

export default StaticRender;
