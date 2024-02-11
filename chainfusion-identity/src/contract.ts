export const contract_address: string =
  "0x03FF7263BeF2B8C8b9dF078c5D28629757C790EC";
export const contract_abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [{ internalType: "uint256", name: "_dids", type: "uint256" }],
    name: "MAX_DIDs_Created",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "issuer", type: "string" },
      {
        indexed: false,
        internalType: "string",
        name: "credential",
        type: "string",
      },
      { indexed: true, internalType: "string", name: "holder", type: "string" },
    ],
    name: "CredentialIssued",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "string", name: "_did", type: "string" },
    ],
    name: "assignDID",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "did", type: "string" }],
    name: "getDIDStatus",
    outputs: [
      {
        internalType: "enum DecentralizeIdentity.DIDStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getDIDs",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "did", type: "string" }],
    name: "getHoldedCredentials",
    outputs: [
      { internalType: "string[]", name: "credentials", type: "string[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "did", type: "string" }],
    name: "getIssuedCredentials",
    outputs: [
      { internalType: "string[]", name: "credentials", type: "string[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "issuer_did", type: "string" },
      { internalType: "string", name: "holder_did", type: "string" },
      { internalType: "string", name: "credential", type: "string" },
    ],
    name: "issueCredentials",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxDIDs",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "string", name: "_did", type: "string" },
    ],
    name: "removeDID",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const test_contract_address: string =
  "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export const test_contract_abi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "assignDID",
    inputs: [{ name: "_did", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getDIDStatus",
    inputs: [{ name: "did", type: "string", internalType: "string" }],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum DecentralizeIdentity.DIDStatus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDIDs",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "string[]", internalType: "string[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getHoldedCredentials",
    inputs: [{ name: "did", type: "string", internalType: "string" }],
    outputs: [
      { name: "credentials", type: "string[]", internalType: "string[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getIssuedCredentials",
    inputs: [{ name: "did", type: "string", internalType: "string" }],
    outputs: [
      { name: "credentials", type: "string[]", internalType: "string[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "issueCredentials",
    inputs: [
      { name: "issuer_did", type: "string", internalType: "string" },
      { name: "holder_did", type: "string", internalType: "string" },
      { name: "credential", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "maxDIDs",
    inputs: [],
    outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "removeDID",
    inputs: [{ name: "_did", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "CredentialIssued",
    inputs: [
      { name: "issuer", type: "string", indexed: true, internalType: "string" },
      {
        name: "credential",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      { name: "holder", type: "string", indexed: true, internalType: "string" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DIDAssigned",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      { name: "did", type: "string", indexed: true, internalType: "string" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DIDRemoved",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      { name: "did", type: "string", indexed: true, internalType: "string" },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "MAX_DIDs_Created",
    inputs: [{ name: "_dids", type: "uint256", internalType: "uint256" }],
  },
  { type: "error", name: "UNDEFINED_OR_EXPIRED_DID", inputs: [] },
  { type: "error", name: "Unauthorized", inputs: [] },
];
