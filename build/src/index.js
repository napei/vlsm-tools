"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ip_address_1 = require("ip-address");
const majorNetwork_1 = require("./majorNetwork");
const utils_1 = require("./utils");
$(() => {
    const maj = new ip_address_1.Address4('80.40.0.0/12');
    const req = [
        { label: 'VLAN37', size: 800 },
        { label: 'VLAN379', size: 200 },
        { label: 'VLAN516', size: 120 },
        { label: 'Database LAN', size: 20 },
        { label: 'VLAN1', size: 6 },
        { label: 'Internal Serial', size: 2 },
    ];
    let sub;
    try {
        sub = new majorNetwork_1.IPv4Network(req, maj);
    }
    catch (e) {
        alert(e);
        return;
    }
    sub.subnets.forEach(s => {
        const requiredHosts = s.requirements.size;
        const hostsInSubnet = Math.pow(2, 32 - s.address.subnetMask) - 2;
        const unusedHosts = hostsInSubnet - requiredHosts;
        const subnetMaskDotted = utils_1.CidrMaskToDottedDecimal(s.address.subnetMask);
        const subnetMaskWildcard = utils_1.DottedDecimalToWildcard(subnetMaskDotted);
        const newRow = $('<tr></tr>');
        newRow.append($(`<th scope="row">${s.requirements.label}</th>`));
        newRow.append($(`<td>${requiredHosts}</td>`));
        newRow.append($(`<td>${hostsInSubnet}</td>`));
        newRow.append($(`<td>${unusedHosts}</td>`));
        newRow.append($(`<td>${s.address.addressMinusSuffix}</td>`));
        newRow.append($(`<td>${s.address.subnet}</td>`));
        newRow.append($(`<td>${subnetMaskDotted}</td>`));
        newRow.append($(`<td>${s.address.startAddressExclusive().address}-${s.address.endAddressExclusive().address}</td>`));
        newRow.append($(`<td>${s.address.endAddress().address}</td>`));
        newRow.append($(`<td>${subnetMaskWildcard}</td>`));
        $('#table-body').append(newRow);
    });
    $('#network-size').html(`<b>Network Size:</b> ${sub.networkSize}`);
    $('#required-size').html(`<b>Required Hosts:</b> ${sub.requiredSize}`);
    $('#unused-size').html(`<b>Unused Hosts:</b> ${sub.unusedSize}`);
    $('#efficiency').html(`<b>Efficiency:</b> ${((sub.requiredSize / (sub.unusedSize + sub.requiredSize)) *
        100).toFixed(2)}%`);
});
//# sourceMappingURL=index.js.map