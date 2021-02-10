import {Address6} from 'ip-address';
import {BigInteger} from 'jsbn';
import {bigIntToAddress, getSubnetBitmaskFromSlash, IPv6PrefixSize, splitSlashSubnet} from './ipv6-utils';

/**
 * Class representing a singular IPv6 Subnet
 *
 * @export
 * @class IPv6Subnet
 */
export class IPv6Address extends Address6 {
  constructor(address: string, optionalGroups?: number | undefined) {
    super(address, optionalGroups);
  }

  /**
   * Returns the number of addresses in the subnet
   *
   * @readonly
   * @memberof IPv6Subnet
   */
  public get size(): number {
    return Math.pow(2, 128 - this.subnetMask);
  }

  /**
   * Returns the number of addresses in the subnet, using a BigInteger class to
   * handle the extremely large numbers.
   *
   * @readonly
   * @type {BigInteger}
   * @memberof IPv6Address
   */
  public get sizeBigInteger(): BigInteger {
    return new BigInteger('2').pow(128 - this.subnetMask);
  }
}

/**
 * Class representing an IPv6 network
 * Subdomain labels and size requirements are not
 * used in this class, as IPv6 is already more than
 * large enough.
 *
 * @export
 * @class IPv6Network
 */
export class IPv6Network {
  /**
   * Major network to perform subnetting against
   *
   * @type {IPv6Address}
   * @memberof IPv6Network
   */
  public readonly majorNetwork: IPv6Address;

  /**
   * Creates an instance of IPv6Network.
   * @param {string} majorNetwork Major network to subnet
   * @param {number} [numSubnets] Required number of subnets
   * @memberof IPv6Network
   */
  constructor(majorNetwork: string) {
    if (majorNetwork.indexOf('/') === -1) {
      throw new Error('Address must be in CIDR slash notation');
    }
    try {
      this.majorNetwork = new IPv6Address(majorNetwork);
    } catch (e) {
      throw new Error(`Unable to parse "${majorNetwork} to an address"`);
    }

    if (!this.majorNetwork.isCorrect) {
      throw new Error(`"${majorNetwork} is incorrect"`);
    }
  }

  /**
   * Will subdivide a network into CIDR networks of provided size. By default,
   * not all will be returned as IPv6 has the capability of generating millions
   * of subnets. If you really want every single one, don't do this in the
   * browser.
   *
   * @param {number} desiredPrefix Desired subdivision size in the form of a CIDR mask
   * @param {boolean} [showAll=false] When false, limit is applied
   * @param {number} [limit=1000] Maximum number of addresses returned
   * @returns {IPv6Address[]} Array of subnets
   * @memberof IPv6Network
   */
  public subdivideIntoPrefixes(desiredPrefix: number, showAll = false, limit = 1000): IPv6Address[] {
    if (!(desiredPrefix >= 0 && desiredPrefix <= 128)) {
      throw new Error('provided prefix is not inside allowable range of 0-128');
    }
    const {subnetMask} = this.majorNetwork;
    if (desiredPrefix < subnetMask) {
      throw new Error(`Unable to fit subnets of size /${desiredPrefix} into a network of size /${subnetMask}`);
    }

    const subnetCount = this.subnetPrefixAllowance(desiredPrefix);
    const networkBitmask = getSubnetBitmaskFromSlash(subnetMask);
    const desiredSize = IPv6PrefixSize(desiredPrefix);

    const outputAddresses: IPv6Address[] = new Array<IPv6Address>();
    const addressString = this.majorNetwork.canonicalForm().replace(/:/g, '');
    let startingAddress = new BigInteger(addressString, 16).and(networkBitmask);
    outputAddresses[0] = bigIntToAddress(startingAddress, desiredPrefix);

    for (let i = 1; i < subnetCount; i++) {
      if (!showAll && i > limit - 1) {
        break;
      }
      const newAddress = startingAddress.add(desiredSize);
      outputAddresses[i] = bigIntToAddress(newAddress, desiredPrefix);
      startingAddress = newAddress;
    }

    return outputAddresses;
  }

  /**
   * Calculates the number of subnets of the provided CIDR prefix size that will
   * fit in the major network
   *
   * @param {number} prefix CIDR prefix size wanted
   * @returns {number} Number of subnets
   * @memberof IPv6Network
   */
  public subnetPrefixAllowance(prefix: number): number {
    const {subnetMask} = this.majorNetwork;
    if (prefix < subnetMask) {
      throw new Error(
        `Unable to fit subnets of size /${prefix} into a network of size /${subnetMask}. Ensure that your desired slash size is larger than the major network's slash.`
      );
    }

    return Math.pow(2, prefix - subnetMask);
  }

  /**
   * Will attempt to split the major network into `n` subnets. Similar to
   * subdivideIntoPrefixes, this has limits applied in order to safely generate
   * a workable set of subnets.
   *
   * @param {number} n Number of subnets to generate
   * @param {boolean} [showAll=false] When false, limit is applied
   * @param {number} [limit=1000] Maximum number of addresses returned
   * @returns {IPv6Address[]} Array of subnets
   * @memberof IPv6Network
   */
  public subdivideIntoNumSubnets(n: number, showAll = false, limit = 1000): IPv6Address[] {
    const prefix = this.majorNetwork.subnetMask;
    const newPrefix = splitSlashSubnet(prefix, n);
    if (newPrefix === -1) {
      throw new Error("Doesn't fit");
    }

    const prefixMask = getSubnetBitmaskFromSlash(prefix);

    const newSlashSize = IPv6PrefixSize(newPrefix);
    const outputAddresses: IPv6Address[] = new Array<IPv6Address>();

    const addressString = this.majorNetwork.canonicalForm().replace(/:/g, '');

    let startingAddress = new BigInteger(addressString, 16).and(prefixMask);

    outputAddresses[0] = bigIntToAddress(startingAddress, newPrefix);

    for (let i = 1; i < n; i++) {
      if (!showAll && i > limit - 1) {
        break;
      }
      const newAddress = startingAddress.add(newSlashSize);
      outputAddresses[i] = bigIntToAddress(newAddress, newPrefix);
      startingAddress = newAddress;
    }

    return outputAddresses;
  }
}
