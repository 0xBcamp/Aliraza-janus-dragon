export const contract_address: string = "0xA91F43471a7D14Ae10cFB432faC3CDD5022ad537";
export const contract_abi: string[] = [
    "function assignDID(address, string) external",
    "function getCredentials(string) external view returns (bytes32[])",
    "function getDIDs(address) external view returns (string[])",
    "function issueCredentials(string, bytes32) external",
    "function maxDIDs() external pure returns (uint8)"
  ];