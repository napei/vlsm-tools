import {Address6} from 'ip-address';
import {BigInteger} from 'jsbn';

export class IPv6Subnet {
  public readonly address: Address6;

  constructor(a: Address6) {
    this.address = a;
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
  private _majorNetwork: Address6;

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
      this._majorNetwork = new Address6(majorNetwork);
    } catch (e) {
      throw `Unable to parse "${majorNetwork} to an address"`;
    }

    if (!this._majorNetwork.isCorrect) {
      throw `"${majorNetwork} is incorrect"`;
    }
  }

  private splitSlashSubnet(
    originalSlash: number,
    numberOfSubnets: number
  ): number {
    let power = 0;
    for (let i = 0; i < 128 - originalSlash; i++) {
      power = Math.pow(2, i);
      if (power >= numberOfSubnets) {
        return originalSlash + i;
      }
    }
    return -1;
  }

  public subdivide(subnetCount: number): Address6[] {
    const slash = this._majorNetwork.subnetMask;
    const newSlash = this.splitSlashSubnet(slash, subnetCount);
    if (newSlash === -1) {
      throw "Doesn't fit";
    }

    const subnetMask = this.getSubnetMaskFromSlash(slash);

    const newSlashSize = new BigInteger('2').pow(128 - newSlash);
    const outputAddresses: Address6[] = new Array<Address6>();

    const addressString = this._majorNetwork.canonicalForm().replace(':', '');

    let startingAddress = new BigInteger(addressString, 16).and(subnetMask);

    const bigIntToAddress = (i: BigInteger, slash: number) => {
      return new Address6(
        `${i
          .toString(16)
          .match(/.{1,4}/g)
          ?.join(':')}/${slash}`
      );
    };
    outputAddresses[0] = bigIntToAddress(startingAddress, newSlash);

    for (let i = 1; i < subnetCount; i++) {
      console.log(this._majorNetwork.subnetMask);
      const newAddress = startingAddress.add(newSlashSize);
      outputAddresses[i] = bigIntToAddress(newAddress, newSlash);
      startingAddress = newAddress;
    }

    return outputAddresses;
  }

  private getSubnetMaskFromSlash(slash: number): BigInteger {
    // Build a binary mask string
    // For example, 1111111111111111:1111111111111111:0 is /32
    let maskstr = '';
    for (let i = 0; i < slash; i++) {
      maskstr += '1';
      if ((i + 1) % 16 === 0) {
        maskstr += ':';
      }
    }

    // Append zero to make complete mask
    if (maskstr[maskstr.length - 1] === ':') {
      maskstr += '0';
    }

    // Convert binary mask into hex mask
    // Append :: to be able to parse as ipv6 address
    const mask =
      maskstr
        .split(':')
        .map(p => {
          return new BigInteger(p, 2).toString(16);
        })
        .join(':') + '::';

    // Return a biginteger representing this number.
    // TODO: There is probably a much faster way to do this that does not involve double construction but this is quick and dirty
    return new BigInteger(
      new Address6(mask).canonicalForm().replace(':', ''),
      16
    );
  }
}
