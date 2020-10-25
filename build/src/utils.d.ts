import { Address4 } from 'ip-address';
import { SubnetRequirements } from './majorNetwork';
export declare function CidrMaskToDottedDecimal(prefix: number): string;
export declare function DottedDecimalToWildcard(dd: string): string;
export declare function CidrSize(c: number): number;
export declare function DoRequirementsFit(requirements: SubnetRequirements[], majorNetwork: Address4): boolean;
export declare function ReduceRequirementsCount(r: SubnetRequirements[]): number;
