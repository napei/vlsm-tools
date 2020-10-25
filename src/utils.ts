import {Address4} from 'ip-address';
import {SubnetRequirements} from './majorNetwork';

export function CidrMaskToDottedDecimal(prefix: number): string {
  const mask = 0xffffffff << (32 - prefix);
  const maskStr = [
    mask >>> 24,
    (mask >> 16) & 0xff,
    (mask >> 8) & 0xff,
    mask & 0xff,
  ].join('.');
  return maskStr;
}

export function DottedDecimalToWildcard(dd: string): string {
  return dd
    .split('.')
    .map(d => 255 - parseInt(d))
    .join('.');
}

export function CidrSize(c: number): number {
  // subtract 2 as host requirements do not
  // include network and broadcast address
  return Math.pow(2, 32 - c) - 2;
}

export function DoRequirementsFit(
  requirements: SubnetRequirements[],
  majorNetwork: Address4
): boolean {
  const majSize = CidrSize(majorNetwork.subnetMask);
  const reqSize = ReduceRequirementsCount(requirements);

  return reqSize < majSize;
}

export function ReduceRequirementsCount(r: SubnetRequirements[]): number {
  return r.reduce((a, b) => {
    return a + b.size;
  }, 0);
}
