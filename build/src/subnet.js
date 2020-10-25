"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subnet = void 0;
const network_1 = require("./network");
class Subnet {
    constructor(hostsEachSubnet, majorNetwork) {
        this.networks = [];
        this.subnetCreated = 0;
        this.power = 0;
        this.majorNetworkPrefix = 0;
        this.hostsEachSubnet = hostsEachSubnet;
        this.majorNetwork = majorNetwork;
        this.needed = hostsEachSubnet.length + 1;
        this.calculate();
    }
    getSubnetCreated() {
        return this.subnetCreated;
    }
    isValid() {
        if (!this.isValidMajorNetwork()) {
            return false;
        }
        return this.power <= 30 - this.majorNetworkPrefix;
    }
    getNetworks() {
        return this.networks;
    }
    isValidMajorNetwork() {
        const ip = this.majorNetwork.split('/');
        if (!(ip.length === 2)) {
            return false;
        }
        this.majorNetworkPrefix = parseInt(ip[1]);
        if (isNaN(this.majorNetworkPrefix)) {
            return false;
        }
        const ipOctets = ip[0].split('.').map(i => parseInt(i));
        for (const i in ipOctets) {
            if (isNaN(ipOctets[i])) {
                return false;
            }
            if (!(ipOctets[i] >= 0 && ipOctets[i] <= 255)) {
                return false;
            }
        }
        if (!(ipOctets.length === 4)) {
            return false;
        }
        return true;
    }
    calculate() {
        if (!this.isValid()) {
            return;
        }
        let majorNetwork = this.majorNetwork;
        this.hostsEachSubnet = this.hostsEachSubnet.sort((a, b) => b - a);
        for (const i in this.hostsEachSubnet) {
            const hosts = this.hostsEachSubnet[i];
            const network = new network_1.Network(hosts, majorNetwork);
            this.networks.push(network);
            const prefix = network.getPrefix().toString();
            majorNetwork = network.getNextNetwork() + '/' + prefix;
        }
        let loop = true;
        while (loop) {
            this.subnetCreated = Math.pow(2, this.power);
            if (isNaN(this.subnetCreated) || this.needed <= this.subnetCreated) {
                loop = false;
                break;
            }
            this.power++;
        }
    }
}
exports.Subnet = Subnet;
//# sourceMappingURL=subnet.js.map