import { Network } from './network';
export declare class Subnet {
    private networks;
    private subnetCreated;
    private power;
    private majorNetworkPrefix;
    private hostsEachSubnet;
    private majorNetwork;
    private needed;
    constructor(hostsEachSubnet: number[], majorNetwork: string);
    getSubnetCreated(): number;
    isValid(): boolean;
    getNetworks(): Network[];
    isValidMajorNetwork(): boolean;
    calculate(): void;
}
