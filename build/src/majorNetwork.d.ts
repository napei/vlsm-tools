import { Address4 } from 'ip-address';
export interface SubnetRequirements {
    label: string;
    size: number;
}
export interface Subnet {
    address: Address4;
    requirements: SubnetRequirements;
}
export declare class IPv4Network {
    private _subnets;
    private _requirements;
    private _majorNetwork;
    constructor(requirements: SubnetRequirements[], majorNetwork: Address4);
    get requiredSize(): number;
    get networkSize(): number;
    get unusedSize(): number;
    get subnets(): Subnet[];
    private calculate;
}
