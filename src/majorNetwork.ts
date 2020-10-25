import {Address4} from 'ip-address';
import {CidrSize, DoRequirementsFit, ReduceRequirementsCount} from './utils';

export interface SubnetRequirements {
  label: string;
  size: number;
}

export interface Subnet {
  address: Address4;
  requirements: SubnetRequirements;
}

export class IPv4Network {
  private _subnets: Subnet[];
  private _requirements: SubnetRequirements[];
  private _majorNetwork: Address4;
  constructor(requirements: SubnetRequirements[], majorNetwork: Address4) {
    this._subnets = [];
    this._requirements = requirements;
    this._majorNetwork = majorNetwork;
    const reqFit = DoRequirementsFit(requirements, majorNetwork);
    if (!reqFit) {
      throw `Unable to fit requirements into a ${majorNetwork.subnet} network`;
    }

    this.calculate();
  }

  public get requiredSize(): number {
    return ReduceRequirementsCount(this._requirements);
  }

  public get networkSize(): number {
    return CidrSize(this._majorNetwork.subnetMask);
  }

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
      this._subnets.push({
        address: subnet,
        requirements: r,
      });

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
