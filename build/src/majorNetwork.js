"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPv4Network = void 0;
const ip_address_1 = require("ip-address");
const utils_1 = require("./utils");
class IPv4Network {
    constructor(requirements, majorNetwork) {
        this._subnets = [];
        this._requirements = requirements;
        this._majorNetwork = majorNetwork;
        const reqFit = utils_1.DoRequirementsFit(requirements, majorNetwork);
        if (!reqFit) {
            throw `Unable to fit requirements into a ${majorNetwork.subnet} network`;
        }
        this.calculate();
    }
    get requiredSize() {
        return utils_1.ReduceRequirementsCount(this._requirements);
    }
    get networkSize() {
        return utils_1.CidrSize(this._majorNetwork.subnetMask);
    }
    get unusedSize() {
        return this.subnets
            .map(s => {
            const hostsInSubnet = Math.pow(2, 32 - s.address.subnetMask) - 2;
            return hostsInSubnet - s.requirements.size;
        })
            .reduce((a, b) => {
            return a + b;
        });
    }
    get subnets() {
        return this._subnets;
    }
    calculate() {
        // Start of the next available network space for subnetting
        // Begin with the current subnet size
        let subnettingNetworkStart = this._majorNetwork;
        // Sort requirements largest first
        this._requirements = this._requirements.sort((a, b) => b.size - a.size);
        this._requirements.forEach((r) => {
            var _a;
            let power = 0;
            let suffix = 32;
            let multiple = 1;
            let loop = true;
            while (loop) {
                const allocatedSize = Math.pow(2, power);
                if (r.size <= allocatedSize - 2) {
                    loop = false;
                    break;
                }
                power++;
                suffix--;
                multiple = multiple * 2;
                if (multiple > 128) {
                    multiple = 1;
                }
            }
            const subnet = new ip_address_1.Address4(`${subnettingNetworkStart.addressMinusSuffix}/${suffix}`);
            this._subnets.push({
                address: subnet,
                requirements: r,
            });
            if (subnet.addressMinusSuffix) {
                const currentNetworkAddress = (_a = subnet.addressMinusSuffix) === null || _a === void 0 ? void 0 : _a.split('.');
                let i = 0;
                if (suffix > 0 && suffix <= 8) {
                    i = 0;
                }
                if (suffix > 8 && suffix <= 16) {
                    i = 1;
                }
                if (suffix > 16 && suffix <= 24) {
                    i = 2;
                }
                if (suffix > 24) {
                    i = 3;
                }
                currentNetworkAddress[i] = (parseInt(currentNetworkAddress[i]) + multiple).toString();
                subnettingNetworkStart = new ip_address_1.Address4(`${currentNetworkAddress.join('.')}/${suffix}`);
            }
            else {
                throw 'error';
            }
        });
    }
}
exports.IPv4Network = IPv4Network;
//# sourceMappingURL=majorNetwork.js.map