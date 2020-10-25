import {Address4} from 'ip-address';
import {
  CidrMaskSize,
  CidrMaskToDottedDecimal,
  DoRequirementsFit,
  DottedDecimalToWildcard,
  RequirementsHostsCount,
} from './utils';

/**
 * Interface representing the requirements for a subnet.
 * Label and size
 *
 * @export
 * @interface SubnetRequirements
 */
export interface SubnetRequirements {
  label: string;
  size: number;
}

/**
 * Class representing a subnet, with its intended requirements
 * and its ipv4 address
 *
 * @export
 * @class Subnet
 */
export class Subnet {
  /**
   * Address representing this subnet
   *
   * @type {Address4}
   * @memberof Subnet
   */
  public readonly address: Address4;

  /**
   * Requirements of the subnet
   *
   * @type {SubnetRequirements}
   * @memberof Subnet
   */
  public readonly requirements: SubnetRequirements;

  /**
   *Creates an instance of Subnet.
   * @param {Address4} a Address
   * @param {SubnetRequirements} r Requirements
   * @memberof Subnet
   */
  constructor(a: Address4, r: SubnetRequirements) {
    this.address = a;
    this.requirements = r;
  }

  /**
   * Size of the network (how many hosts excluding the network and broadcast addresses)
   *
   * @readonly
   * @type {number}
   * @memberof Subnet
   */
  public get networkSize(): number {
    return CidrMaskSize(this.address.subnetMask);
  }

  /**
   *
   * Number of unused/unallocated hosts in the subnet
   * @readonly
   * @type {number}
   * @memberof Subnet
   */
  public get unusedSize(): number {
    return this.requirements.size - this.networkSize;
  }

  /**
   *
   * The subnet mask in dotted-decimal notation xxx.xxx.xxx.xxx
   * @readonly
   * @type {string}
   * @memberof Subnet
   */
  public get subnetMaskDottedDecimal(): string {
    return CidrMaskToDottedDecimal(this.address.subnetMask);
  }

  /**
   *
   * The dotted-decimal subnet mask wildcard/inverse
   * @readonly
   * @type {string}
   * @memberof Subnet
   */
  public get subnetMaskWildcard(): string {
    return DottedDecimalToWildcard(this.subnetMaskDottedDecimal);
  }

  /**
   *
   * The efficiency of this subnet
   * @readonly
   * @type {number}
   * @memberof IPv4Network
   */
  public get efficiency(): number {
    return this.requirements.size / (this.unusedSize + this.requirements.size);
  }
}

/**
 * Class representing an IPv4 Network that will contain
 * several subnets
 *
 * @export
 * @class IPv4Network
 */
export class IPv4Network {
  private _subnets: Subnet[];
  private _requirements: SubnetRequirements[];
  private _majorNetwork: Address4;

  /**
   * Creates an instance of IPv4Network.
   * @param {SubnetRequirements[]} requirements Array of requirements for the desired subnets
   * @param {string} majorNetwork Major network that will be subnetted in slash notation x.x.x.x/xx
   * @memberof IPv4Network
   */
  constructor(requirements: SubnetRequirements[], majorNetwork: string) {
    this._subnets = [];
    this._requirements = requirements;
    if (majorNetwork.indexOf('/') === -1) {
      throw 'Address must be in slash notation';
    }
    try {
      this._majorNetwork = new Address4(majorNetwork);
    } catch (e) {
      throw `Unable to parse "${majorNetwork}" to an address`;
    }

    if (!this._majorNetwork.isCorrect) {
      throw `"${majorNetwork}" is incorrect`;
    }

    const reqFit = DoRequirementsFit(requirements, this._majorNetwork);
    if (!reqFit) {
      throw `Unable to fit requirements into a ${this._majorNetwork.subnet} network`;
    }

    this.calculate();
  }

  /**
   *
   * The required size of the network based on the requirements
   * @readonly
   * @type {number}
   * @memberof IPv4Network
   */
  public get requiredSize(): number {
    return RequirementsHostsCount(this._requirements);
  }

  /**
   *
   * The number of usable hosts in the major network
   * Excludes the network and broadcast addresses
   * @readonly
   * @type {number}
   * @memberof IPv4Network
   */
  public get networkSize(): number {
    return CidrMaskSize(this._majorNetwork.subnetMask);
  }

  /**
   *
   * The number of unused hosts in the network
   * @readonly
   * @type {number}
   * @memberof IPv4Network
   */
  public get unusedSize(): number {
    return this.subnets
      .map(s => {
        const hostsInSubnet = Math.pow(2, 32 - s.address.subnetMask) - 2;
        return hostsInSubnet - s.requirements.size;
      })
      .reduce((a, b) => {
        return a + b;
      });
  }

  /**
   *
   * The efficiency of the subnetting process
   * @readonly
   * @type {number}
   * @memberof IPv4Network
   */
  public get efficiency(): number {
    return this.requiredSize / (this.unusedSize + this.requiredSize);
  }

  /**
   *
   * The resulting subnets of the network
   * @readonly
   * @type {Subnet[]}
   * @memberof IPv4Network
   */
  public get subnets(): Subnet[] {
    return this._subnets;
  }

  private calculate(): void {
    // Start of the next available network space for subnetting
    // Begin with the current subnet size
    let subnettingNetworkStart = this._majorNetwork;
    // Sort requirements largest first
    this._requirements = this._requirements.sort((a, b) => b.size - a.size);

    this._requirements.forEach((r: SubnetRequirements) => {
      let power = 0;
      let suffix = 32;
      let multiple = 1;
      let loop = true;
      while (loop) {
        const allocatedSize = Math.pow(2, power);
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
      const subnet = new Address4(
        `${subnettingNetworkStart.addressMinusSuffix}/${suffix}`
      );
      this._subnets.push(new Subnet(subnet, r));

      if (subnet.addressMinusSuffix) {
        const currentNetworkAddress = subnet.addressMinusSuffix?.split('.');
        let i = 0;
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

        currentNetworkAddress[i] = (
          parseInt(currentNetworkAddress[i]) + multiple
        ).toString();
        subnettingNetworkStart = new Address4(
          `${currentNetworkAddress.join('.')}/${suffix}`
        );
      } else {
        throw 'error';
      }
    });
  }
}
