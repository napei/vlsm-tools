import { Address4 } from 'ip-address';
import { SubnetRequirements } from './majorNetwork';
/**
 * Converts a CIDR mask (/xx) to dotted decimal
 * notation (255.255.255.255)
 *
 * @export
 * @param {number} mask CIDR Mask number
 * @returns {string} Dotted Decimal Subnet Mask
 */
export declare function CidrMaskToDottedDecimal(mask: number): string;
/**
 * Converts a dotted decimal subnet mask to its wildcard
 *
 * @export
 * @param {string} mask Dotted decimal subnet mask
 * @returns {string} Wildcard string
 */
export declare function DottedDecimalToWildcard(mask: string): string;
/**
 * Calculates the size of a CIDR subnet mask
 * Excludes the network and broadcast address
 *
 * @export
 * @param {number} mask CIDR Mask
 * @returns {number} Size
 */
export declare function CidrMaskSize(mask: number): number;
/**
 * Check if a list of requirements will fit inside a major network
 *
 * @export
 * @param {SubnetRequirements[]} requirements List of requirements
 * @param {Address4} majorNetwork Major network
 * @returns {boolean} Does it fit?
 */
export declare function DoRequirementsFit(requirements: SubnetRequirements[], majorNetwork: Address4): boolean;
/**
 * Get the total number of hosts from a list of requirements
 *
 * @export
 * @param {SubnetRequirements[]} r List of requirements
 * @returns {number} Number of hosts required
 */
export declare function RequirementsHostsCount(r: SubnetRequirements[]): number;
