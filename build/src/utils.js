"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReduceRequirementsCount = exports.DoRequirementsFit = exports.CidrSize = exports.DottedDecimalToWildcard = exports.CidrMaskToDottedDecimal = void 0;
function CidrMaskToDottedDecimal(prefix) {
    var mask = 0xffffffff << (32 - prefix);
    var maskStr = [
        mask >>> 24,
        (mask >> 16) & 0xff,
        (mask >> 8) & 0xff,
        mask & 0xff,
    ].join('.');
    return maskStr;
}
exports.CidrMaskToDottedDecimal = CidrMaskToDottedDecimal;
function DottedDecimalToWildcard(dd) {
    return dd
        .split('.')
        .map(function (d) { return 255 - parseInt(d); })
        .join('.');
}
exports.DottedDecimalToWildcard = DottedDecimalToWildcard;
function CidrSize(c) {
    // subtract 2 as host requirements do not
    // include network and broadcast address
    return Math.pow(2, 32 - c) - 2;
}
exports.CidrSize = CidrSize;
function DoRequirementsFit(requirements, majorNetwork) {
    var majSize = CidrSize(majorNetwork.subnetMask);
    var reqSize = ReduceRequirementsCount(requirements);
    return reqSize < majSize;
}
exports.DoRequirementsFit = DoRequirementsFit;
function ReduceRequirementsCount(r) {
    return r.reduce(function (a, b) {
        return a + b.size;
    }, 0);
}
exports.ReduceRequirementsCount = ReduceRequirementsCount;
//# sourceMappingURL=utils.js.map