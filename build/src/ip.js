"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IP = void 0;
const IP_REGEX = /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}/gi;
class IP {
    constructor(ip) {
        this._octets = [];
        if (!ip) {
            return;
        }
        if (ip === '') {
            return;
        }
        if (!IP_REGEX.test(ip)) {
            return;
        }
        this._octets = ip.split('.').map(i => parseInt(i.trim()));
    }
    toString() {
        return this._octets.join('.');
    }
    get octets() {
        return this.octets;
    }
}
exports.IP = IP;
//# sourceMappingURL=ip.js.map