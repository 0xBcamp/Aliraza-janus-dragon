// /* eslint-disable @typescript-eslint/no-use-before-define */
// /* eslint-disable no-console */
// /* eslint-disable @typescript-eslint/no-shadow */

"use client";

import { Container } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
  LocalAccountSigner,
  type Hex,
  SmartAccountSigner,
  WalletClientSigner,
} from "@alchemy/aa-core";
import { sepolia } from "viem/chains";
// IMP START - Quick Start
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
// IMP END - Quick Start
import Web3 from "web3";
import { createWalletClient, custom, encodeFunctionData } from "viem";
import CounterABI from "../../artifacts/contracts/Counter.sol/Counter.json";
import Navbar from "../navbar";

require("dotenv").config();

// IMP START - SDK Initialization
// IMP START - Dashboard Registration
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Please use 0x1 for Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const web3auth = new Web3Auth({
  clientId,
  chainConfig,
  web3AuthNetwork: "sapphire_mainnet",
});
// IMP END - SDK Initialization

function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [alchemyProvider, setAlchemyProvider] =
    useState<AlchemyProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // IMP START - SDK Initialization
        await web3auth.initModal();
        // IMP END - SDK Initialization
        setProvider(web3auth.provider);
        const walletClient = createWalletClient({
          chain: sepolia, // can provide a different chain here
          transport: custom(web3auth.provider as any),
        });

        const signer: SmartAccountSigner = new WalletClientSigner(
          walletClient,
          "json-rpc" // signerType
        );
        // IMP END - Login
        const chain = sepolia;

        // Create a provider to send user operations from your smart account
        const alchemyProvider = new AlchemyProvider({
          // get your Alchemy API key at https://dashboard.alchemy.com
          apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
          chain,
        }).connect(
          (rpcClient) =>
            new LightSmartContractAccount({
              rpcClient,
              owner: signer,
              chain,
              factoryAddress: getDefaultLightAccountFactoryAddress(chain),
            })
        );
        setAlchemyProvider(alchemyProvider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  async function login() {
    // IMP START - Login
    const web3authProvider = await web3auth.connect();
    console.log(web3authProvider);
    const web3 = new Web3(web3authProvider as any);
    console.log(web3.provider);
    console.log(await web3.eth.getAccounts());
    const walletClient = createWalletClient({
      chain: sepolia, // can provide a different chain here
      transport: custom(web3authProvider as any),
    });

    const signer: SmartAccountSigner = new WalletClientSigner(
      walletClient,
      "json-rpc" // signerType
    );
    // IMP END - Login
    setProvider(web3authProvider);
    const chain = sepolia;

    // Create a provider to send user operations from your smart account
    const alchemyProvider = new AlchemyProvider({
      // get your Alchemy API key at https://dashboard.alchemy.com
      apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
      chain,
    }).connect(
      (rpcClient) =>
        new LightSmartContractAccount({
          rpcClient,
          owner: signer,
          chain,
          factoryAddress: getDefaultLightAccountFactoryAddress(chain),
        })
    );
    setAlchemyProvider(alchemyProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  }

  const getUserInfo = async () => {
    // IMP START - Get User Information
    const user = await web3auth.getUserInfo();
    // IMP END - Get User Information
    uiConsole(user);
  };

  const logout = async () => {
    // IMP START - Logout
    await web3auth.logout();
    // IMP END - Logout
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  // IMP START - Blockchain Calls
  const getAccounts = async () => {
    if (!alchemyProvider) {
      uiConsole("provider not initialized yet");
      return;
    }

    // Get user's Ethereum public address
    const address = await alchemyProvider?.getAddress();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!alchemyProvider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const web3 = new Web3(alchemyProvider as any);

    const address = await alchemyProvider.getAddress();
    console.log(address);
    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    uiConsole(balance);
  };

  const increment = async () => {
    const uoCallData = encodeFunctionData({
      abi: CounterABI.abi,
      functionName: "increment",
    });
    alchemyProvider?.withAlchemyGasManager({
      policyId: process.env.NEXT_PUBLIC_POLICY_ID as string, // replace with your policy id, get yours at https://dashboard.alchemy.com/
    });

    // If gas sponsorship ineligible, baypass paymaster middleware by passing in the paymasterAndData override

    // Empty paymasterAndData indicates that there will be no paymaster involved
    // and the user will be paying for the gas fee even when `withAlchemyGasManager` is configured on the provider

    const elligibility = await alchemyProvider?.checkGasSponsorshipEligibility({
      target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
      data: uoCallData,
    });
    console.log(elligibility);
    // if `elligibility` === false, inform users about their ineligibility,
    // either notifying or asking for consent to proceed with gas fee being paid from their account balance

    // To proceed with bypassing the paymster middleware
    const overrides: any = { paymasterAndData: "0x" };

    const uo = await alchemyProvider?.sendUserOperation(
      {
        target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
        data: uoCallData,
      },
      elligibility ? undefined : overrides // for ineligible user operations, set the paymasterAndData override
    );

    const txHash = await alchemyProvider?.waitForUserOperationTransaction(
      uo!.hash
    );

    console.log(txHash);
  };

  const decrement = async () => {
    const uoCallData = encodeFunctionData({
      abi: CounterABI.abi,
      functionName: "decrement",
    });
    alchemyProvider?.withAlchemyGasManager({
      policyId: "33354292-10cc-4068-8126-0265735faeff", // replace with your policy id, get yours at https://dashboard.alchemy.com/
    });

    const elligibility = await alchemyProvider?.checkGasSponsorshipEligibility({
      target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
      data: uoCallData,
    });
    console.log(elligibility);
    // if `elligibility` === false, inform users about their ineligibility,
    // either notifying or asking for consent to proceed with gas fee being paid from their account balance

    // To proceed with bypassing the paymster middleware
    const overrides: any = { paymasterAndData: "0x" };

    const uo = await alchemyProvider?.sendUserOperation(
      {
        target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
        data: uoCallData,
      },
      elligibility ? undefined : overrides // for ineligible user operations, set the paymasterAndData override
    );

    const txHash = await alchemyProvider?.waitForUserOperationTransaction(
      uo!.hash
    );

    console.log(txHash);
  };

  const tripleIncrement = async () => {
    const uoCallData = encodeFunctionData({
      abi: CounterABI.abi,
      functionName: "increment",
    });
    alchemyProvider?.withAlchemyGasManager({
      policyId: process.env.NEXT_PUBLIC_POLICY_ID as string, // replace with your policy id, get yours at https://dashboard.alchemy.com/
    });

    const elligibility = await alchemyProvider?.checkGasSponsorshipEligibility({
      target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
      data: uoCallData,
    });
    console.log(elligibility);
    // if `elligibility` === false, inform users about their ineligibility,
    // either notifying or asking for consent to proceed with gas fee being paid from their account balance

    // To proceed with bypassing the paymster middleware
    const overrides: any = { paymasterAndData: "0x" };

    const uo = await alchemyProvider?.sendUserOperation(
      [
        {
          target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
          data: uoCallData,
        },
        {
          target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
          data: uoCallData,
        },
        {
          target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
          data: uoCallData,
        },
      ],
      elligibility ? undefined : overrides // for ineligible user operations, set the paymasterAndData override
    );

    const txHash = await alchemyProvider?.waitForUserOperationTransaction(
      uo!.hash
    );

    console.log(txHash);
  };

  const tripleDecrement = async () => {
    const uoCallData = encodeFunctionData({
      abi: CounterABI.abi,
      functionName: "decrement",
    });
    alchemyProvider?.withAlchemyGasManager({
      policyId: process.env.NEXT_PUBLIC_POLICY_ID as string, // replace with your policy id, get yours at https://dashboard.alchemy.com/
    });

    const elligibility = await alchemyProvider?.checkGasSponsorshipEligibility({
      target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
      data: uoCallData,
    });
    console.log(elligibility);
    // if `elligibility` === false, inform users about their ineligibility,
    // either notifying or asking for consent to proceed with gas fee being paid from their account balance

    // To proceed with bypassing the paymster middleware
    const overrides: any = { paymasterAndData: "0x" };

    const uo = await alchemyProvider?.sendUserOperation(
      [
        {
          target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
          data: uoCallData,
        },
        {
          target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
          data: uoCallData,
        },
        {
          target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
          data: uoCallData,
        },
      ],
      elligibility ? undefined : overrides // for ineligible user operations, set the paymasterAndData override
    );

    const txHash = await alchemyProvider?.waitForUserOperationTransaction(
      uo!.hash
    );

    console.log(txHash);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
    uiConsole(signedMessage);
  };
  // IMP END - Blockchain Calls

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={increment} className="card">
            Increment
          </button>
        </div>
        <div>
          <button onClick={decrement} className="card">
            Decrement
          </button>
        </div>
        <div>
          <button onClick={tripleIncrement} className="card">
            Increment x 3
          </button>
        </div>
        <div>
          <button onClick={tripleDecrement} className="card">
            Decrement x 3
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <Container maxW="110%">
      <Container height="35vh">
        <button onClick={login} className="card">
          Login
        </button>
      </Container>
      <svg
        width="110%"
        height="100%"
        id="svg"
        viewBox="0 0 1440 490"
        xmlns="http://www.w3.org/2000/svg"
        className="transition duration-300 ease-in-out delay-150"
      >
        <defs>
          <linearGradient id="gradient" x1="41%" y1="1%" x2="59%" y2="99%">
            <stop offset="5%" stop-color="#a75af7"></stop>
            <stop offset="95%" stop-color="#f24861"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,500 L 0,125 C 73.10133974579182,97.58467880453452 146.20267949158364,70.16935760906904 205,77 C 263.79732050841636,83.83064239093096 308.2906217794572,124.90724836825834 387,136 C 465.7093782205428,147.09275163174166 578.6348333905875,128.20164891789761 648,115 C 717.3651666094125,101.79835108210237 743.1700446581931,94.28615596015115 792,112 C 840.8299553418069,129.71384403984885 912.6849879766405,172.65372724149776 990,186 C 1067.3150120233595,199.34627275850224 1150.0900034352455,183.09893507385777 1226,168 C 1301.9099965647545,152.90106492614223 1370.9549982823773,138.9505324630711 1440,125 L 1440,500 L 0,500 Z"
          stroke="none"
          stroke-width="0"
          fill="url(#gradient)"
          fill-opacity="0.53"
          className="transition-all duration-300 ease-in-out delay-150 path-0"
        ></path>
        <defs>
          <linearGradient id="gradient" x1="41%" y1="1%" x2="59%" y2="99%">
            <stop offset="5%" stop-color="#a75af7"></stop>
            <stop offset="95%" stop-color="#f24861"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,500 L 0,291 C 60.68223978014427,265.45757471659226 121.36447956028854,239.91514943318447 199,252 C 276.63552043971146,264.08485056681553 371.22432153899,313.79697698385434 442,318 C 512.77567846101,322.20302301614566 559.7382342837512,280.89694263139813 619,271 C 678.2617657162488,261.10305736860187 749.8227413260048,282.6152524905531 827,284 C 904.1772586739952,285.3847475094469 986.9708004122292,266.64204740638957 1049,266 C 1111.0291995877708,265.35795259361043 1152.2940570250773,282.81655788388866 1214,290 C 1275.7059429749227,297.18344211611134 1357.8529714874612,294.09172105805567 1440,291 L 1440,500 L 0,500 Z"
          stroke="none"
          stroke-width="0"
          fill="url(#gradient)"
          fill-opacity="1"
          className="transition-all duration-300 ease-in-out delay-150 path-1"
        ></path>
      </svg>
    </Container>
  );

  return (
    <div className="container max-w-full">
      <Navbar />
      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
    </div>
  );
}

export default App;
