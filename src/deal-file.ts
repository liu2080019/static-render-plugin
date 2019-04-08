import * as path from 'path';
import * as fs from 'fs';
const mkdirp = require('mkdirp-promise');
const minify = require('html-minifier').minify;

class DealFile {
  _resource: any;

  constructor(resource: any) {
    this._resource = resource;
  }

  async createHtml(htmlList: any) {
    return Promise.all(htmlList.map((htmlInfo: any) => {
      const outputFile = path.join(this._resource, `${htmlInfo.name}.html`);

      return mkdirp(this._resource)
        .then(() => {
          return new Promise((resolve, reject) => {
            fs.writeFile(outputFile, minify(htmlInfo.html, {
              removeComments: true,
              collapseWhitespace: true,
              minifyJS:true,
              minifyCSS:true
            }), err => {
              if (err) reject(`写文件失败"${outputFile}" \n ${err}.`)
            });

            resolve()
          })
        })
        .catch((err: any) => {
          if (typeof err === 'string') {
            err = `创建文件失败\n ${err}`
          }
          throw err
        })
    }));
  }
}

export default DealFile;
