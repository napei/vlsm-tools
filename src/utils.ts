import {Address4} from 'ip-address';
import {SubnetRequirements} from './ipv4';

/**
 * Converts a CIDR mask (/xx) to dotted decimal
 * notation (255.255.255.255)
 *
 * @export
 * @param {number} mask CIDR Mask number
 * @returns {string} Dotted Decimal Subnet Mask
 */
export function CidrMaskToDottedDecimal(mask: number): string {
  const bitMask = 0xffffffff << (32 - mask);
  const maskStr = [
    bitMask >>> 24,
    (bitMask >> 16) & 0xff,
    (bitMask >> 8) & 0xff,
    bitMask & 0xff,
  ].join('.');
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
 * Excludes the network and broadcast address
 *
 * @export
 * @param {number} mask CIDR Mask
 * @returns {number} Size
 */
export function CidrMaskSize(mask: number): number {
  // subtract 2 as host requirements do not
  // include network and broadcast address
  return Math.pow(2, 32 - mask) - 2;
}

/**
 * Check if a list of requirements will fit inside a major network
 *
 * @export
 * @param {SubnetRequirements[]} requirements List of requirements
 * @param {Address4} majorNetwork Major network
 * @returns {boolean} Does it fit?
 */
export function DoRequirementsFit(
  requirements: SubnetRequirements[],
  majorNetwork: Address4
): boolean {
  const majSize = CidrMaskSize(majorNetwork.subnetMask);
  const reqSize = RequirementsHostsCount(requirements);

  return reqSize < majSize;
}

/**
 * Get the total number of hosts from a list of requirements
 *
 * @export
 * @param {SubnetRequirements[]} r List of requirements
 * @returns {number} Number of hosts required
 */
export function RequirementsHostsCount(r: SubnetRequirements[]): number {
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
