import {BigInteger} from 'jsbn';
import {IPv6Address} from './ipv6';

/**
 * Returns the number of addresses in an IPv6 Prefix
 *
 * @export
 * @param {number} prefix Prefix
 * @returns {BigInteger} Size
 */
export function IPv6PrefixSize(prefix: number): BigInteger {
  return new BigInteger('2').pow(128 - prefix);
}

export function getSubnetBitmaskFromSlash(slash: number): BigInteger {
  // Build a binary mask string of 128 1s or zeroes
  // For example, 1111111111111111 1111111111111111 is /32
  let mask = '';

  for (let i = 1; i <= 128; i++) {
    if (i <= slash) {
      mask += '1';
    } else {
      mask += '0';
    }
  }

  // Convert binary mask into BigInteger
  return new BigInteger(mask, 2);
}

export function splitSlashSubnet(originalSlash: number, numberOfSubnets: number): number {
  let power = 0;
  for (let i = 0; i < 128 - originalSlash; i++) {
    power = Math.pow(2, i);
    if (power >= numberOfSubnets) {
      return originalSlash + i;
    }
  }
  return -1;
}

export function bigIntToAddress(i: BigInteger, slash: number): IPv6Address {
  const hex = i.toString(16);
  let address: string;
  if (hex === '0') {
    address = `0::/${slash}`;
  } else {
    address = `${hex.match(/.{1,4}/g)?.join(':')}/${slash}`;
  }

  const out = new IPv6Address(address);

  return out;
}
