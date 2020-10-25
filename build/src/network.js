"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPv4Network = void 0;
class IPv4Network {
    /**
     *Creates an instance of IPv4Network.
     * @param {SubnetRequirements} requirements Size requirements for this network & label.
     * @param {string} majorNetwork The start of the network with which to begin allocation
     * @memberof IPv4Network
     */
    constructor(requirements, majorNetwork) {
        this._requirements = requirements;
        this._majorNetwork = majorNetwork;
        this._power = 0;
        this._prefix = 32;
        this._allocatedSize = 0;
        this._netWorkMultiplie = 1;
        this._majorNetworkPrefix = 0;
        this._ipOctets = [];
        this._octetIndex = 0;
        this.calculate();
    }
    get label() {
        return this._requirements.label;
    }
    get requiredSize() {
        return this._requirements.size;
    }
    get allocatedSize() {
        return this._allocatedSize;
    }
    get prefix() {
        return this._prefix;
    }
    getNetworkMultiple() {
        return this._netWorkMultiplie;
    }
    getMask() {
        return 256 - this.getNetworkMultiple();
    }
    getMajorNetworkPrefix() {
        return this._majorNetworkPrefix;
    }
    getSubnetMask() {
        if (this.prefix < 9) {
            return this.getMask().toString() + '.0.0.0';
        }
        if (this.prefix < 17) {
            return '255.' + this.getMask().toString() + '.0.0';
        }
        if (this.prefix < 25) {
            return '255.255.' + this.getMask().toString() + '.0';
        }
        return '255.255.255.' + this.getMask().toString();
    }
    get networkAddress() {
        if (!this.isValidMajorNetwork()) {
            return '';
        }
        if (this._majorNetworkPrefix > 0 && this._majorNetworkPrefix <= 8) {
            return this._ipOctets[0].toString() + '.0.0.0';
        }
        if (this._majorNetworkPrefix <= 16) {
            return this._ipOctets.slice(0, 2).join('.') + '.0.0';
        }
        if (this._majorNetworkPrefix <= 24) {
            return this._ipOctets.slice(0, 3).join('.') + '.0';
        }
        return this._ipOctets.join('.');
    }
    get nextNetwork() {
        const network = this.networkAddress.split('.');
        if (this.prefix > 0 && this.prefix <= 8) {
            this._octetIndex = 0;
        }
        if (this.prefix > 8 && this.prefix <= 16) {
            this._octetIndex = 1;
        }
        if (this.prefix > 16 && this.prefix <= 24) {
            this._octetIndex = 2;
        }
        if (this.prefix > 24) {
            this._octetIndex = 3;
        }
        network[this._octetIndex] = (parseInt(network[this._octetIndex]) + this._netWorkMultiplie).toString();
        return network.join('.');
    }
    getBroadcast() {
        const broadcast = this.ipToInt(this.nextNetwork);
        broadcast[this._octetIndex]--;
        if (this._octetIndex > 0 && this._octetIndex < 3) {
            for (let i = this._octetIndex + 1; i <= 3; i++) {
                if (broadcast[i] === 0) {
                    broadcast[i] = 255;
                }
                else {
                    broadcast[i]--;
                }
            }
        }
        return broadcast.join('.');
    }
    getFirstIP() {
        const ip = this.ipToInt(this.networkAddress);
        ip[3]++;
        return ip.join('.');
    }
    getLastIP() {
        const ip = this.ipToInt(this.getBroadcast());
        ip[3]--;
        return ip.join('.');
    }
    calculate() {
        if (this._requirements.size < 2) {
            return;
        }
        if (!this.isValidMajorNetwork()) {
            return;
        }
        let loop = true;
        while (loop) {
            this._allocatedSize = Math.pow(2, this._power);
            if (this._requirements.size <= this._allocatedSize - 2) {
                loop = false;
                break;
            }
            this._power++;
            this._prefix--;
            this._netWorkMultiplie = this._netWorkMultiplie * 2;
            if (this._netWorkMultiplie > 128) {
                this._netWorkMultiplie = 1;
            }
        }
    }
    ipToInt(ip) {
        return ip.split('.').map(i => parseInt(i));
    }
    isValidMajorNetwork() {
        const ip = this._majorNetwork.split('/');
        if (!(ip.length === 2)) {
            return false;
        }
        this._ipOctets = this.ipToInt(ip[0]);
        this._majorNetworkPrefix = parseInt(ip[1]);
        if (!(this._ipOctets.length === 4)) {
            return false;
        }
        for (const octet in this._ipOctets) {
            if (!(this._ipOctets[octet] >= 0 && this._ipOctets[octet] <= 255)) {
                return false;
            }
        }
        return true;
    }
}
exports.IPv4Network = IPv4Network;
//# sourceMappingURL=network.js.map