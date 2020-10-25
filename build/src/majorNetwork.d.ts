import { Address4 } from 'ip-address';
/**
 * Interface representing the requirements for a subnet.
 * Label and size
 *
 * @export
 * @interface SubnetRequirements
 */
export interface SubnetRequirements {
    label: string;
    size: number;
}
/**
 * Interface representing a subnet, with its intended requirements
 * and its ipv4 address
 *
 * @export
 * @interface Subnet
 */
export interface Subnet {
    address: Address4;
    requirements: SubnetRequirements;
}
/**
 * Class representing an IPv4 Network that will contain
 * several subnets
 *
 * @export
 * @class IPv4Network
 */
export declare class IPv4Network {
    private _subnets;
    private _requirements;
    private _majorNetwork;
    /**
     * Creates an instance of IPv4Network.
     * @param {SubnetRequirements[]} requirements Array of requirements for the desired subnets
     * @param {Address4} majorNetwork Major network that will be subnetted
     * @memberof IPv4Network
     */
    constructor(requirements: SubnetRequirements[], majorNetwork: Address4);
    /**
     *
     * The required size of the network based on the requirements
     * @readonly
     * @type {number}
     * @memberof IPv4Network
     */
    get requiredSize(): number;
    /**
     *
     * The number of usable hosts in the major network
     * Excludes the network and broadcast addresses
     * @readonly
     * @type {number}
     * @memberof IPv4Network
     */
    get networkSize(): number;
    /**
     *
     * The number of unused hosts in the network
     * @readonly
     * @type {number}
     * @memberof IPv4Network
     */
    get unusedSize(): number;
    /**
     *
     * The efficiency of the subnetting process
     * @readonly
     * @type {number}
     * @memberof IPv4Network
     */
    get efficiency(): number;
    /**
     *
     * The resulting subnets of the network
     * @readonly
     * @type {Subnet[]}
     * @memberof IPv4Network
     */
    get subnets(): Subnet[];
    private calculate;
}
