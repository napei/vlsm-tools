import {IPv4Network} from '../src';

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
