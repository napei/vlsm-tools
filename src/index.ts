export {IPv4SubnetRequirements, IPv4Network, IPv4Subnet} from './ipv4/ipv4';
export {IPv6Network} from './ipv6/ipv6';
export {
  CidrMaskSize,
  CidrMaskToDottedDecimal,
  DoIPv4RequirementsFit,
  DottedDecimalToWildcard,
  ParseIPv4Address,
  IPv4RequirementsHostsCount,
} from './ipv4/ipv4-utils';

// const n = new IPv6Network('2001:db8::/4');
// const divided = n.subdivideIntoPrefixes(11);
// console.dir(
//   divided.map(n => {
//     return n.address;
//   }),
//   {maxArrayLength: null}
// );
