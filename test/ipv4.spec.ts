import {
  CidrMaskToDottedDecimal,
  DottedDecimalToWildcard,
  IPv4Network,
} from '../src';

describe('CIDR Mask Conversion', () => {
  it('should correctly convert all CIDR numbers to subnet masks', () => {
    const results = [
      '0.0.0.0',
      '128.0.0.0',
      '192.0.0.0',
      '224.0.0.0',
      '240.0.0.0',
      '248.0.0.0',
      '252.0.0.0',
      '254.0.0.0',
      '255.0.0.0',
      '255.128.0.0',
      '255.192.0.0',
      '255.224.0.0',
      '255.240.0.0',
      '255.248.0.0',
      '255.252.0.0',
      '255.254.0.0',
      '255.255.0.0',
      '255.255.128.0',
      '255.255.192.0',
      '255.255.224.0',
      '255.255.240.0',
      '255.255.248.0',
      '255.255.252.0',
      '255.255.254.0',
      '255.255.255.0',
      '255.255.255.128',
      '255.255.255.192',
      '255.255.255.224',
      '255.255.255.240',
      '255.255.255.248',
      '255.255.255.252',
      '255.255.255.254',
      '255.255.255.255',
    ];

    for (let i = 0; i < results.length; i++) {
      expect(CidrMaskToDottedDecimal(i)).toEqual(results[i]);
    }
  });
});

describe('Subnet wildcard conversion', () => {
  it('should convert subnet masks to wildcards correctly', () => {
    const tests = [
      ['0.0.0.0', '255.255.255.255'],
      ['128.0.0.0', '127.255.255.255'],
      ['192.0.0.0', '63.255.255.255'],
      ['224.0.0.0', '31.255.255.255'],
      ['240.0.0.0', '15.255.255.255'],
      ['248.0.0.0', '7.255.255.255'],
      ['252.0.0.0', '3.255.255.255'],
      ['254.0.0.0', '1.255.255.255'],
      ['255.0.0.0', '0.255.255.255'],
      ['255.128.0.0', '0.127.255.255'],
      ['255.192.0.0', '0.63.255.255'],
      ['255.224.0.0', '0.31.255.255'],
      ['255.240.0.0', '0.15.255.255'],
      ['255.248.0.0', '0.7.255.255'],
      ['255.252.0.0', '0.3.255.255'],
      ['255.254.0.0', '0.1.255.255'],
      ['255.255.0.0', '0.0.255.255'],
      ['255.255.128.0', '0.0.127.255'],
      ['255.255.192.0', '0.0.63.255'],
      ['255.255.224.0', '0.0.31.255'],
      ['255.255.240.0', '0.0.15.255'],
      ['255.255.248.0', '0.0.7.255'],
      ['255.255.252.0', '0.0.3.255'],
      ['255.255.254.0', '0.0.1.255'],
      ['255.255.255.0', '0.0.0.255'],
      ['255.255.255.128', '0.0.0.127'],
      ['255.255.255.192', '0.0.0.63'],
      ['255.255.255.224', '0.0.0.31'],
      ['255.255.255.240', '0.0.0.15'],
      ['255.255.255.248', '0.0.0.7'],
      ['255.255.255.252', '0.0.0.3'],
      ['255.255.255.254', '0.0.0.1'],
      ['255.255.255.255', '0.0.0.0'],
    ];
    tests.forEach((v: string[]) => {
      expect(DottedDecimalToWildcard(v[0])).toEqual(v[1]);
    });
  });
});

describe('IPv4 Subnetting Cases', () => {
  it('should subnet 10.0.0.0/8 correctly', () => {
    const network = new IPv4Network(
      [
        {label: 'test1', size: 123},
        {label: 'test2', size: 123},
        {label: 'test3', size: 1234},
        {label: 'test4', size: 123},
      ],
      '10.0.0.0/8'
    );

    const expected = [
      '10.0.0.0/21',
      '10.0.8.0/25',
      '10.0.8.128/25',
      '10.0.9.0/25',
    ];

    expect(network.subnets).toBeInstanceOf(Array);
    network.subnets.forEach((s, i) => {
      expect(s.address.address).toEqual(expected[i]);
    });
  });

  it('should subnet a larger network', () => {
    const network = new IPv4Network(
      [
        {label: 'test1', size: 350},
        {label: 'test2', size: 250},
        {label: 'test3', size: 80},
        {label: 'test4', size: 50},
        {label: 'test5', size: 20},
        {label: 'test6', size: 2},
        {label: 'test7', size: 2},
        {label: 'test8', size: 2},
        {label: 'test9', size: 2},
        {label: 'test10', size: 2},
        {label: 'test11', size: 2},
      ],
      '10.0.0.0/8'
    );

    const expected = [
      '10.0.0.0/23',
      '10.0.2.0/24',
      '10.0.3.0/25',
      '10.0.3.128/26',
      '10.0.3.192/27',
      '10.0.3.224/30',
      '10.0.3.228/30',
      '10.0.3.232/30',
      '10.0.3.236/30',
      '10.0.3.240/30',
      '10.0.3.244/30',
    ];

    expect(network.subnets).toBeInstanceOf(Array);
    network.subnets.forEach((s, i) => {
      expect(s.address.address).toEqual(expected[i]);
    });
  });
});