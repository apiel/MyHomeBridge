"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
require("babel-polyfill"); // find a solution to get rid of that
require('es6-promise').polyfill(); // find a solution to get rid of that
const request = require("request-promise");
const child_process_1 = require("child_process");
class default_1 {
    constructor(itemModel) {
        this.itemModel = itemModel;
    }
    toggle(availableStatus, status) {
        for (let val of availableStatus) {
            if (!status) {
                status = val;
                break;
            }
            else if (status === val) {
                status = null;
            }
        }
        if (!status) {
            status = availableStatus[0];
        }
        return status;
    }
    setStatus(id, status) {
        let item = this.itemModel.get(id);
        if (item.type === "number") {
            this.setStatusOfTypeNumber(item, status);
        }
        else {
            this.setStatusOfTypeString(item, status);
        }
        this.itemModel.save();
        this.setStatusAction(item);
        return item;
    }
    setStatusAction(item) {
        if (item.url) {
            request(item.url.replace(':value', item.status));
        }
        else if (item.availableStatus) {
            let itemStatus = item.availableStatus[item.status];
            if (itemStatus.type === 'url') {
                request(itemStatus.value);
            }
            else if (itemStatus.type === 'exec') {
                child_process_1.exec(itemStatus.value);
            }
        }
    }
    setStatusOfTypeNumber(item, status) {
        if (isNaN(Number(status))) {
            throw "Status is not a number.";
        }
        else {
            item.status = status;
        }
    }
    setStatusOfTypeString(item, status) {
        let availableStatus = Object.keys(item.availableStatus);
        if (availableStatus.indexOf(status) > -1) {
            item.status = status;
        }
        else if (status === "toggle") {
            item.status = this.toggle(availableStatus, item.status);
        }
        else {
            throw "Status does not exist";
        }
    }
    all() {
        let items = this.itemModel.all();
        let itemsKeys = Object.keys(items);
        return Promise.all(itemsKeys.map(key => this.getStatus(key)));
    }
    getStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            let item = this.itemModel.get(id);
            if (item.statusUrl) {
                response = yield this.getStatusFromUrl(id, item.statusUrl);
            }
            else {
                let status = item.type === "number" ? Number(item.status) : item.status;
                response = { id: id, status: status };
            }
            return response;
        });
    }
    getStatusFromUrl(id, url) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = yield request(url);
            var data = JSON.parse(body);
            if (!data || !data.status)
                throw { id: id, error: body };
            return { id: id, status: data.status };
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
