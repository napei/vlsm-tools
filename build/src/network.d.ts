import { SubnetRequirements } from './majorNetwork';
export declare class IPv4Network {
    private _requirements;
    private _majorNetwork;
    private _power;
    private _prefix;
    private _allocatedSize;
    private _netWorkMultiplie;
    private _majorNetworkPrefix;
    private _ipOctets;
    private _octetIndex;
    get label(): string;
    /**
     *Creates an instance of IPv4Network.
     * @param {SubnetRequirements} requirements Size requirements for this network & label.
     * @param {string} majorNetwork The start of the network with which to begin allocation
     * @memberof IPv4Network
     */
    constructor(requirements: SubnetRequirements, majorNetwork: string);
    get requiredSize(): number;
    get allocatedSize(): number;
    get prefix(): 32;
    private getNetworkMultiple;
    private getMask;
    private getMajorNetworkPrefix;
    private getSubnetMask;
    get networkAddress(): string;
    get nextNetwork(): string;
    private getBroadcast;
    private getFirstIP;
    private getLastIP;
    private calculate;
    private ipToInt;
    private isValidMajorNetwork;
}
