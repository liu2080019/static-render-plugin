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
const fs = require("fs");
const mkdirp = require('mkdirp-promise');
class DealFile {
    constructor(resource) {
        this._resource = resource;
    }
    createHtml(htmlList) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(htmlList.map((htmlInfo) => {
                const outputFile = path.join(this._resource, `${htmlInfo.route === '/' ? 'home' : htmlInfo.route}.html`);
                return mkdirp(this._resource)
                    .then(() => {
                    return new Promise((resolve, reject) => {
                        fs.writeFile(outputFile, htmlInfo.html.trim(), err => {
                            if (err)
                                reject(`写文件失败"${outputFile}" \n ${err}.`);
                        });
                        resolve();
                    });
                })
                    .catch((err) => {
                    if (typeof err === 'string') {
                        err = `创建文件失败\n ${err}`;
                    }
                    throw err;
                });
            }));
        });
    }
}
exports.default = DealFile;
//# sourceMappingURL=deal-file.js.map