"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirementsHostsCount = exports.DoRequirementsFit = exports.CidrMaskSize = exports.DottedDecimalToWildcard = exports.CidrMaskToDottedDecimal = void 0;
/**
 * Converts a CIDR mask (/xx) to dotted decimal
 * notation (255.255.255.255)
 *
 * @export
 * @param {number} mask CIDR Mask number
 * @returns {string} Dotted Decimal Subnet Mask
 */
function CidrMaskToDottedDecimal(mask) {
    var bitMask = 0xffffffff << (32 - mask);
    var maskStr = [
        bitMask >>> 24,
        (bitMask >> 16) & 0xff,
        (bitMask >> 8) & 0xff,
        bitMask & 0xff,
    ].join('.');
    return maskStr;
}
exports.CidrMaskToDottedDecimal = CidrMaskToDottedDecimal;
/**
 * Converts a dotted decimal subnet mask to its wildcard
 *
 * @export
 * @param {string} mask Dotted decimal subnet mask
 * @returns {string} Wildcard string
 */
function DottedDecimalToWildcard(mask) {
    return mask
        .split('.')
        .map(function (d) { return 255 - parseInt(d); })
        .join('.');
}
exports.DottedDecimalToWildcard = DottedDecimalToWildcard;
/**
 * Calculates the size of a CIDR subnet mask
 * Excludes the network and broadcast address
 *
 * @export
 * @param {number} mask CIDR Mask
 * @returns {number} Size
 */
function CidrMaskSize(mask) {
    // subtract 2 as host requirements do not
    // include network and broadcast address
    return Math.pow(2, 32 - mask) - 2;
}
exports.CidrMaskSize = CidrMaskSize;
/**
 * Check if a list of requirements will fit inside a major network
 *
 * @export
 * @param {SubnetRequirements[]} requirements List of requirements
 * @param {Address4} majorNetwork Major network
 * @returns {boolean} Does it fit?
 */
function DoRequirementsFit(requirements, majorNetwork) {
    var majSize = CidrMaskSize(majorNetwork.subnetMask);
    var reqSize = RequirementsHostsCount(requirements);
    return reqSize < majSize;
}
exports.DoRequirementsFit = DoRequirementsFit;
/**
 * Get the total number of hosts from a list of requirements
 *
 * @export
 * @param {SubnetRequirements[]} r List of requirements
 * @returns {number} Number of hosts required
 */
function RequirementsHostsCount(r) {
    return r.reduce(function (a, b) {
        return a + b.size;
    }, 0);
}
exports.RequirementsHostsCount = RequirementsHostsCount;
//# sourceMappingURL=utils.js.map