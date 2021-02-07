import {assert} from 'console';
import {Address6} from 'ip-address';
import {BigInteger} from 'jsbn';
import {bigIntToAddress, getSubnetBitmaskFromSlash, IPv6PrefixSize, splitSlashSubnet} from './ipv6-utils';

export class IPv6Subnet {
  public readonly address: Address6;

  constructor(a: Address6) {
    this.address = a;
  }

  public get networkAddress(): string {
    return this.address.addressMinusSuffix;
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
  public readonly majorNetwork: Address6;

  /**
   *Creates an instance of IPv6Network.
   * @param {string} majorNetwork Major network to subnet
   * @param {number} [numSubnets] Required number of subnets
   * @memberof IPv6Network
   */
  constructor(majorNetwork: string) {
    if (majorNetwork.indexOf('/') === -1) {
      throw 'Address must be in CIDR slash notation';
    }
    try {
      this.majorNetwork = new Address6(majorNetwork);
    } catch (e) {
      throw `Unable to parse "${majorNetwork} to an address"`;
    }

    if (!this.majorNetwork.isCorrect) {
      throw `"${majorNetwork} is incorrect"`;
    }
  }

  public subdivideIntoPrefixes(desiredPrefix: number): Address6[] {
    assert(desiredPrefix >= 0 && desiredPrefix <= 128);
    const networkPrefix = this.majorNetwork.subnetMask;
    if (desiredPrefix < networkPrefix) {
      throw `Unable to fit subnets of size /${desiredPrefix} into a network of size /${networkPrefix}`;
    }

    const subnetCount = Math.pow(2, desiredPrefix - networkPrefix);

    const networkBitmask = getSubnetBitmaskFromSlash(networkPrefix);
    const desiredSize = IPv6PrefixSize(desiredPrefix);

    const outputAddresses: Address6[] = new Array<Address6>();
    const addressString = this.majorNetwork.canonicalForm().replace(/:/g, '');
    let startingAddress = new BigInteger(addressString, 16).and(networkBitmask);
    outputAddresses[0] = bigIntToAddress(startingAddress, desiredPrefix);

    for (let i = 1; i < subnetCount; i++) {
      const newAddress = startingAddress.add(desiredSize);
      outputAddresses[i] = bigIntToAddress(newAddress, desiredPrefix);
      startingAddress = newAddress;
    }

    return outputAddresses;
  }

  public subdivideIntoSubnets(nSubnets: number): Address6[] {
    const prefix = this.majorNetwork.subnetMask;
    const newPrefix = splitSlashSubnet(prefix, nSubnets);
    if (newPrefix === -1) {
      throw "Doesn't fit";
    }

    const prefixMask = getSubnetBitmaskFromSlash(prefix);

    const newSlashSize = IPv6PrefixSize(newPrefix);
    const outputAddresses: Address6[] = new Array<Address6>();

    const addressString = this.majorNetwork.canonicalForm().replace(/:/g, '');

    let startingAddress = new BigInteger(addressString, 16).and(prefixMask);

    outputAddresses[0] = bigIntToAddress(startingAddress, newPrefix);

    for (let i = 1; i < nSubnets; i++) {
      const newAddress = startingAddress.add(newSlashSize);
      outputAddresses[i] = bigIntToAddress(newAddress, newPrefix);
      startingAddress = newAddress;
    }

    return outputAddresses;
  }
}
