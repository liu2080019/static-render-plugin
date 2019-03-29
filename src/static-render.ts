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
    this._puppeteer = await puppeteer.launch(this._options)
  }

  destroy () { }

  renderDelay() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), this._delay);
    })
  }

  async go () {
    const pagePromises = Promise.all(
      this._routes.map(route =>
        async () => {
          // 新建页面
          const page = await this._puppeteer.newPage();
          // 设置URL
          const url = `http://localhost:${this._port}`;
          // 页面跳转
          await page.goto(`${url}${route}`, { waituntil: 'networkidle0' });

          await page.evaluate(this.renderDelay);

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
