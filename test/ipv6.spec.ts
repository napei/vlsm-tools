import {IPv6Network} from '../src';

describe('IPv6 Subnetting', () => {
  it('should subdivide ipv6 network by 2', () => {
    const net = new IPv6Network('2001:0db8:85a3::8a2e:0370:7334/32').subdivideIntoNumSubnets(2);

    const result = net.map(aa => {
      return aa.address;
    });

    const expected = ['2001:0db8:0000:0000:0000:0000:0000:0000/33', '2001:0db8:8000:0000:0000:0000:0000:0000/33'];

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(expected.length);

    result.forEach((s, i) => {
      expect(s).toEqual(expected[i]);
    });
  });

  it('should calculate subnet allowance correctly', () => {
    const network = new IPv6Network('2001:db8::/4');

    const expected = [
      [64, 1152921504606847000],
      [10, 64],
      [127, 10633823966279326983230456482242756608],
    ];

    expect(network).toBeDefined();
    expected.forEach(e => {
      expect(network.subnetPrefixAllowance(e[0])).toEqual(e[1]);
    });
  });

  it('should only return the first 1000 subnets by default', () => {
    const result = new IPv6Network('2001:db8::/4').subdivideIntoPrefixes(64);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1000);
  });

  it('should return all subnets when `showAll` is set to true', () => {
    const result = new IPv6Network('2001:db8::/4').subdivideIntoPrefixes(20, true);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(65536);
  });

  it('should return n subnets when `limit` is set to n', () => {
    const result = new IPv6Network('2001:db8::/4').subdivideIntoPrefixes(64, false, 67);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(67);
  });

  it('should limit results when subdividing by number', () => {
    const result = new IPv6Network('2001:0db8:85a3::8a2e:0370:7334/32').subdivideIntoNumSubnets(10000);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1000);
  });

  it('should respect a custom limit when subdiving by number', () => {
    const result = new IPv6Network('2001:0db8:85a3::8a2e:0370:7334/32').subdivideIntoNumSubnets(10000, false, 1234);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1234);
  });

  it('should return all subnets when subdiving by number without limits', () => {
    const result = new IPv6Network('2001:0db8:85a3::8a2e:0370:7334/32').subdivideIntoNumSubnets(2000, true);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(2000);
  });

  it('should sibdivide by prefix correctly', () => {
    const result = new IPv6Network('2001:db8::/4').subdivideIntoPrefixes(11);

    const expected = [
      '2000:0000:0000:0000:0000:0000:0000:0000/11',
      '2020:0000:0000:0000:0000:0000:0000:0000/11',
      '2040:0000:0000:0000:0000:0000:0000:0000/11',
      '2060:0000:0000:0000:0000:0000:0000:0000/11',
      '2080:0000:0000:0000:0000:0000:0000:0000/11',
      '20a0:0000:0000:0000:0000:0000:0000:0000/11',
      '20c0:0000:0000:0000:0000:0000:0000:0000/11',
      '20e0:0000:0000:0000:0000:0000:0000:0000/11',
      '2100:0000:0000:0000:0000:0000:0000:0000/11',
      '2120:0000:0000:0000:0000:0000:0000:0000/11',
      '2140:0000:0000:0000:0000:0000:0000:0000/11',
      '2160:0000:0000:0000:0000:0000:0000:0000/11',
      '2180:0000:0000:0000:0000:0000:0000:0000/11',
      '21a0:0000:0000:0000:0000:0000:0000:0000/11',
      '21c0:0000:0000:0000:0000:0000:0000:0000/11',
      '21e0:0000:0000:0000:0000:0000:0000:0000/11',
      '2200:0000:0000:0000:0000:0000:0000:0000/11',
      '2220:0000:0000:0000:0000:0000:0000:0000/11',
      '2240:0000:0000:0000:0000:0000:0000:0000/11',
      '2260:0000:0000:0000:0000:0000:0000:0000/11',
      '2280:0000:0000:0000:0000:0000:0000:0000/11',
      '22a0:0000:0000:0000:0000:0000:0000:0000/11',
      '22c0:0000:0000:0000:0000:0000:0000:0000/11',
      '22e0:0000:0000:0000:0000:0000:0000:0000/11',
      '2300:0000:0000:0000:0000:0000:0000:0000/11',
      '2320:0000:0000:0000:0000:0000:0000:0000/11',
      '2340:0000:0000:0000:0000:0000:0000:0000/11',
      '2360:0000:0000:0000:0000:0000:0000:0000/11',
      '2380:0000:0000:0000:0000:0000:0000:0000/11',
      '23a0:0000:0000:0000:0000:0000:0000:0000/11',
      '23c0:0000:0000:0000:0000:0000:0000:0000/11',
      '23e0:0000:0000:0000:0000:0000:0000:0000/11',
      '2400:0000:0000:0000:0000:0000:0000:0000/11',
      '2420:0000:0000:0000:0000:0000:0000:0000/11',
      '2440:0000:0000:0000:0000:0000:0000:0000/11',
      '2460:0000:0000:0000:0000:0000:0000:0000/11',
      '2480:0000:0000:0000:0000:0000:0000:0000/11',
      '24a0:0000:0000:0000:0000:0000:0000:0000/11',
      '24c0:0000:0000:0000:0000:0000:0000:0000/11',
      '24e0:0000:0000:0000:0000:0000:0000:0000/11',
      '2500:0000:0000:0000:0000:0000:0000:0000/11',
      '2520:0000:0000:0000:0000:0000:0000:0000/11',
      '2540:0000:0000:0000:0000:0000:0000:0000/11',
      '2560:0000:0000:0000:0000:0000:0000:0000/11',
      '2580:0000:0000:0000:0000:0000:0000:0000/11',
      '25a0:0000:0000:0000:0000:0000:0000:0000/11',
      '25c0:0000:0000:0000:0000:0000:0000:0000/11',
      '25e0:0000:0000:0000:0000:0000:0000:0000/11',
      '2600:0000:0000:0000:0000:0000:0000:0000/11',
      '2620:0000:0000:0000:0000:0000:0000:0000/11',
      '2640:0000:0000:0000:0000:0000:0000:0000/11',
      '2660:0000:0000:0000:0000:0000:0000:0000/11',
      '2680:0000:0000:0000:0000:0000:0000:0000/11',
      '26a0:0000:0000:0000:0000:0000:0000:0000/11',
      '26c0:0000:0000:0000:0000:0000:0000:0000/11',
      '26e0:0000:0000:0000:0000:0000:0000:0000/11',
      '2700:0000:0000:0000:0000:0000:0000:0000/11',
      '2720:0000:0000:0000:0000:0000:0000:0000/11',
      '2740:0000:0000:0000:0000:0000:0000:0000/11',
      '2760:0000:0000:0000:0000:0000:0000:0000/11',
      '2780:0000:0000:0000:0000:0000:0000:0000/11',
      '27a0:0000:0000:0000:0000:0000:0000:0000/11',
      '27c0:0000:0000:0000:0000:0000:0000:0000/11',
      '27e0:0000:0000:0000:0000:0000:0000:0000/11',
      '2800:0000:0000:0000:0000:0000:0000:0000/11',
      '2820:0000:0000:0000:0000:0000:0000:0000/11',
      '2840:0000:0000:0000:0000:0000:0000:0000/11',
      '2860:0000:0000:0000:0000:0000:0000:0000/11',
      '2880:0000:0000:0000:0000:0000:0000:0000/11',
      '28a0:0000:0000:0000:0000:0000:0000:0000/11',
      '28c0:0000:0000:0000:0000:0000:0000:0000/11',
      '28e0:0000:0000:0000:0000:0000:0000:0000/11',
      '2900:0000:0000:0000:0000:0000:0000:0000/11',
      '2920:0000:0000:0000:0000:0000:0000:0000/11',
      '2940:0000:0000:0000:0000:0000:0000:0000/11',
      '2960:0000:0000:0000:0000:0000:0000:0000/11',
      '2980:0000:0000:0000:0000:0000:0000:0000/11',
      '29a0:0000:0000:0000:0000:0000:0000:0000/11',
      '29c0:0000:0000:0000:0000:0000:0000:0000/11',
      '29e0:0000:0000:0000:0000:0000:0000:0000/11',
      '2a00:0000:0000:0000:0000:0000:0000:0000/11',
      '2a20:0000:0000:0000:0000:0000:0000:0000/11',
      '2a40:0000:0000:0000:0000:0000:0000:0000/11',
      '2a60:0000:0000:0000:0000:0000:0000:0000/11',
      '2a80:0000:0000:0000:0000:0000:0000:0000/11',
      '2aa0:0000:0000:0000:0000:0000:0000:0000/11',
      '2ac0:0000:0000:0000:0000:0000:0000:0000/11',
      '2ae0:0000:0000:0000:0000:0000:0000:0000/11',
      '2b00:0000:0000:0000:0000:0000:0000:0000/11',
      '2b20:0000:0000:0000:0000:0000:0000:0000/11',
      '2b40:0000:0000:0000:0000:0000:0000:0000/11',
      '2b60:0000:0000:0000:0000:0000:0000:0000/11',
      '2b80:0000:0000:0000:0000:0000:0000:0000/11',
      '2ba0:0000:0000:0000:0000:0000:0000:0000/11',
      '2bc0:0000:0000:0000:0000:0000:0000:0000/11',
      '2be0:0000:0000:0000:0000:0000:0000:0000/11',
      '2c00:0000:0000:0000:0000:0000:0000:0000/11',
      '2c20:0000:0000:0000:0000:0000:0000:0000/11',
      '2c40:0000:0000:0000:0000:0000:0000:0000/11',
      '2c60:0000:0000:0000:0000:0000:0000:0000/11',
      '2c80:0000:0000:0000:0000:0000:0000:0000/11',
      '2ca0:0000:0000:0000:0000:0000:0000:0000/11',
      '2cc0:0000:0000:0000:0000:0000:0000:0000/11',
      '2ce0:0000:0000:0000:0000:0000:0000:0000/11',
      '2d00:0000:0000:0000:0000:0000:0000:0000/11',
      '2d20:0000:0000:0000:0000:0000:0000:0000/11',
      '2d40:0000:0000:0000:0000:0000:0000:0000/11',
      '2d60:0000:0000:0000:0000:0000:0000:0000/11',
      '2d80:0000:0000:0000:0000:0000:0000:0000/11',
      '2da0:0000:0000:0000:0000:0000:0000:0000/11',
      '2dc0:0000:0000:0000:0000:0000:0000:0000/11',
      '2de0:0000:0000:0000:0000:0000:0000:0000/11',
      '2e00:0000:0000:0000:0000:0000:0000:0000/11',
      '2e20:0000:0000:0000:0000:0000:0000:0000/11',
      '2e40:0000:0000:0000:0000:0000:0000:0000/11',
      '2e60:0000:0000:0000:0000:0000:0000:0000/11',
      '2e80:0000:0000:0000:0000:0000:0000:0000/11',
      '2ea0:0000:0000:0000:0000:0000:0000:0000/11',
      '2ec0:0000:0000:0000:0000:0000:0000:0000/11',
      '2ee0:0000:0000:0000:0000:0000:0000:0000/11',
      '2f00:0000:0000:0000:0000:0000:0000:0000/11',
      '2f20:0000:0000:0000:0000:0000:0000:0000/11',
      '2f40:0000:0000:0000:0000:0000:0000:0000/11',
      '2f60:0000:0000:0000:0000:0000:0000:0000/11',
      '2f80:0000:0000:0000:0000:0000:0000:0000/11',
      '2fa0:0000:0000:0000:0000:0000:0000:0000/11',
      '2fc0:0000:0000:0000:0000:0000:0000:0000/11',
      '2fe0:0000:0000:0000:0000:0000:0000:0000/11',
    ];

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(expected.length);
    result.forEach((v, i) => {
      expect(v.address).toEqual(expected[i]);
    });
  });
});
