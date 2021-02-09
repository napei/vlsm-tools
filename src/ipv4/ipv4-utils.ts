import {Address4} from 'ip-address';
import {BigInteger} from 'jsbn';
import {IPv4SubnetRequirements} from './ipv4';

/**
 * Converts a CIDR mask (/xx) to dotted decimal
 * notation (255.255.255.255)
 *
 * @export
 * @param {number} mask CIDR Mask number
 * @returns {string} Dotted Decimal Subnet Mask
 */
export function CidrMaskToDottedDecimal(mask: number): string {
  if (!(mask > -1 && mask < 33)) {
    throw new Error('provided mask is not inside the CIDR range of 0 - 32');
  }

  const m = new BigInteger('0xffffffff', 16).shiftLeft(32 - mask);
  const bitMask = parseInt(`0x${m.toString(16)}`);
  const maskStr = [bitMask >>> 24, (bitMask >> 16) & 0xff, (bitMask >> 8) & 0xff, bitMask & 0xff].join('.');
  return maskStr;
}

/**
 * Converts a dotted decimal subnet mask to its wildcard
 *
 * @export
 * @param {string} mask Dotted decimal subnet mask
 * @returns {string} Wildcard string
 */
export function DottedDecimalToWildcard(mask: string): string {
  return mask
    .split('.')
    .map(d => 255 - parseInt(d))
    .join('.');
}

/**
 * Calculates the size of a CIDR subnet mask
 *
 * @export
 * @param {number} mask CIDR Mask
 * @returns {number} Size
 */
export function CidrMaskSize(mask: number): number {
  return Math.pow(2, 32 - mask);
}

/**
 * Check if a list of requirements will fit inside a major network
 *
 * @export
 * @param {IPv4SubnetRequirements[]} requirements List of requirements
 * @param {Address4} majorNetwork Major network
 * @returns {boolean} Does it fit?
 */
export function DoIPv4RequirementsFit(requirements: IPv4SubnetRequirements[], majorNetwork: Address4): boolean {
  const majSize = CidrMaskSize(majorNetwork.subnetMask);
  const reqSize = IPv4RequirementsHostsCount(requirements);

  return reqSize < majSize;
}

/**
 * Get the total number of hosts from a list of IPv4 requirements
 *
 * @export
 * @param {IPv4SubnetRequirements[]} r List of requirements
 * @returns {number} Number of hosts required
 */
export function IPv4RequirementsHostsCount(r: IPv4SubnetRequirements[]): number {
  return r.reduce((a, b) => {
    return a + b.size;
  }, 0);
}

/**
 * Parses an IP address, using the same library as the
 * rest of this package
 *
 * @export
 * @param {string} i input string to parse
 * @returns {boolean} is valid or not
 */
export function ParseIPv4Address(i: string): boolean {
  return new Address4(i).isCorrect();
}
