"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPv4Network = void 0;
var ip_address_1 = require("ip-address");
var utils_1 = require("./utils");
/**
 * Class representing an IPv4 Network that will contain
 * several subnets
 *
 * @export
 * @class IPv4Network
 */
var IPv4Network = /** @class */ (function () {
    /**
     * Creates an instance of IPv4Network.
     * @param {SubnetRequirements[]} requirements Array of requirements for the desired subnets
     * @param {Address4} majorNetwork Major network that will be subnetted
     * @memberof IPv4Network
     */
    function IPv4Network(requirements, majorNetwork) {
        this._subnets = [];
        this._requirements = requirements;
        this._majorNetwork = majorNetwork;
        var reqFit = utils_1.DoRequirementsFit(requirements, majorNetwork);
        if (!reqFit) {
            throw "Unable to fit requirements into a " + majorNetwork.subnet + " network";
        }
        this.calculate();
    }
    Object.defineProperty(IPv4Network.prototype, "requiredSize", {
        /**
         *
         * The required size of the network based on the requirements
         * @readonly
         * @type {number}
         * @memberof IPv4Network
         */
        get: function () {
            return utils_1.RequirementsHostsCount(this._requirements);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IPv4Network.prototype, "networkSize", {
        /**
         *
         * The number of usable hosts in the major network
         * Excludes the network and broadcast addresses
         * @readonly
         * @type {number}
         * @memberof IPv4Network
         */
        get: function () {
            return utils_1.CidrMaskSize(this._majorNetwork.subnetMask);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IPv4Network.prototype, "unusedSize", {
        /**
         *
         * The number of unused hosts in the network
         * @readonly
         * @type {number}
         * @memberof IPv4Network
         */
        get: function () {
            return this.subnets
                .map(function (s) {
                var hostsInSubnet = Math.pow(2, 32 - s.address.subnetMask) - 2;
                return hostsInSubnet - s.requirements.size;
            })
                .reduce(function (a, b) {
                return a + b;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IPv4Network.prototype, "efficiency", {
        /**
         *
         * The efficiency of the subnetting process
         * @readonly
         * @type {number}
         * @memberof IPv4Network
         */
        get: function () {
            return this.requiredSize / (this.unusedSize + this.requiredSize);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IPv4Network.prototype, "subnets", {
        /**
         *
         * The resulting subnets of the network
         * @readonly
         * @type {Subnet[]}
         * @memberof IPv4Network
         */
        get: function () {
            return this._subnets;
        },
        enumerable: false,
        configurable: true
    });
    IPv4Network.prototype.calculate = function () {
        var _this = this;
        // Start of the next available network space for subnetting
        // Begin with the current subnet size
        var subnettingNetworkStart = this._majorNetwork;
        // Sort requirements largest first
        this._requirements = this._requirements.sort(function (a, b) { return b.size - a.size; });
        this._requirements.forEach(function (r) {
            var _a;
            var power = 0;
            var suffix = 32;
            var multiple = 1;
            var loop = true;
            while (loop) {
                var allocatedSize = Math.pow(2, power);
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
            var subnet = new ip_address_1.Address4(subnettingNetworkStart.addressMinusSuffix + "/" + suffix);
            _this._subnets.push({
                address: subnet,
                requirements: r,
            });
            if (subnet.addressMinusSuffix) {
                var currentNetworkAddress = (_a = subnet.addressMinusSuffix) === null || _a === void 0 ? void 0 : _a.split('.');
                var i = 0;
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
                subnettingNetworkStart = new ip_address_1.Address4(currentNetworkAddress.join('.') + "/" + suffix);
            }
            else {
                throw 'error';
            }
        });
    };
    return IPv4Network;
}());
exports.IPv4Network = IPv4Network;
//# sourceMappingURL=majorNetwork.js.map