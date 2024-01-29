export interface DecentralizeIdentityContract {
    assignDID(address: string, did: string): string;
    getDIDs(address: string): string[];
}