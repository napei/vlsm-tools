import {IPv6Network} from '../src';

describe('IPv6 Subnetting Cases', () => {
  it('should subdivide ipv6 network by 2', () => {
    const net = new IPv6Network('2001:0db8:85a3::8a2e:0370:7334/32').subdivide(
      2
    );
    const result = net.map(aa => {
      return aa.address;
    });
    const expected = [
      '2001:0db8:0000:0000:0000:0000:0000:0000/33',
      '2001:0db8:8000:0000:0000:0000:0000:0000/33',
    ];
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(expected.length);
    result.forEach((s, i) => {
      expect(s).toEqual(expected[i]);
    });
  });
});
