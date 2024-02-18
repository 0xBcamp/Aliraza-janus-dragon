"use client";
import {
	EmailLoginInput,
	EmailSignupInput,
} from '@moonup/moon-api';
import { useState } from 'react';

import { AUTH, MOON_SESSION_KEY, Storage } from '@moonup/moon-types';
import { useMoonSDK } from './usemoonsdk';
import CounterABI from "../../artifacts/contracts/Counter.sol/Counter.json";
import {MoonSigner,MoonProvider, MoonProviderOptions} from '@moonup/ethers';
import { createWalletClient, custom, encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
import { SmartAccountSigner, WalletClientSigner } from '@alchemy/aa-core';
import { AlchemyProvider } from '@alchemy/aa-alchemy';
import { LightSmartContractAccount, getDefaultLightAccountFactoryAddress } from '@alchemy/aa-accounts';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { convertEthersSignerToAccountSigner } from '@alchemy/aa-ethers';
import LandingPage from './page';

import '../styles/globals.css'
import Navbar from './navbar';

require('dotenv').config();

const SignupPage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [signupSuccess, setSignupSuccess] = useState(false);
	const [signInSuccess, setSignInSuccess] = useState(false);
	const [authenticatedAddress, setAuthenticatedAddress] = useState('');
	const [alchemyProvider, setAlchemyProvider] = useState<AlchemyProvider | null>(null);
  	const [loggedIn, setLoggedIn] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { moon, connect,moonSigner,moonProvider, createAccount, disconnect, updateToken, initialize } =
		useMoonSDK();

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleConfirmPasswordChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setConfirmPassword(event.target.value);
	};

	const handleInitializeAndConnect = async () => {
		try {
			setLoading(true);
			setError(null);

			// Initialize and connect to Moon
			console.log('Initializing and connecting to Moon...');
			await initialize();
			await connect();
			console.log('Connected to Moon!');
			setIsConnected(true);
		} catch (error) {
			console.error('Error during connection:', error);
			setError('Error connecting to Moon. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleSignup = async () => {
		try {
			setLoading(true);
			setError(null);

			if (password !== confirmPassword) {
				setPasswordError('Passwords do not match');
			} else {
				setPasswordError('');

				// Sign up the user
				const auth = moon?.getAuthSDK();
				const signupRequest: EmailSignupInput = {
					email,
					password,
				};
				console.log('Signing up...');
				const signupResponse: any = await auth?.emailSignup(signupRequest);
				console.log('Signup successful:', signupResponse);

				setSignupSuccess(true);
			}
		} catch (error) {
			console.error('Error during signup:', error);
			setError('Error signing up. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleSignIn = async () => {
		try {
			setLoading(true);
			setError(null);
			
			const auth = moon?.getAuthSDK();
			const loginRequest: EmailLoginInput = {
				email,
				password,
			};
			console.log('Authenticating...');
			const loginResponse: any = await auth?.emailLogin(loginRequest);
			console.log('Authentication successful:', loginResponse);

			// Set tokens and email
			console.log('Updating tokens and email...');
			await updateToken(
				loginResponse.data.token,
				loginResponse.data.refreshToken
			);
			moon?.MoonAccount.setEmail(email);
			moon?.MoonAccount.setExpiry(loginResponse.data.expiry);
			console.log('Tokens and email updated!');

			// Perform sign-in logic with MoonSDK
			console.log('Creating account...');
			const newAccount = await createAccount();
			console.log('New Account Data:', newAccount?.data);
			console.log('Setting expiry and navigating...');
			moon?.MoonAccount.setExpiry(loginResponse.data.expiry);
			setSignInSuccess(true);
			setAuthenticatedAddress(newAccount?.data?.data?.address);
			console.log('Authenticated Address:', newAccount?.data.data?.address);
			const config = {
				Storage: {
					key: MOON_SESSION_KEY,
					type: Storage.SESSION,
				},
				Auth: {
					AuthType: AUTH.JWT,
				},
			}
		const options: MoonProviderOptions = {
			chainId: 11155111,
			SDK:moon,
			address:newAccount?.data.data?.address
		};
			const moonProvider = new MoonProvider(options);
			const web3 = new Web3(moonProvider);
			console.log(web3)

	// 		const walletClient = createWalletClient({
    //   			chain: sepolia, // can provide a different chain here
    //   			transport: custom(web3 as any),
    // 		});
	// console.log(walletClient)
	const moonSigner2 = new MoonSigner(moonProvider, config)
	console.log(moonSigner2)
	const accountSigner: SmartAccountSigner = convertEthersSignerToAccountSigner(moonSigner2);
	console.log(accountSigner)
	console.log(await accountSigner.getAddress())
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
          owner:accountSigner,
          chain,
          factoryAddress: getDefaultLightAccountFactoryAddress(chain),
        })
    );
	setAlchemyProvider(alchemyProvider)
	console.log(alchemyProvider);
		} catch (error) {
			console.error('Error during sign-in:', error);
			setError('Error signing in. Please try again.');
		} finally {
			setLoading(false);
		}
	};



	const handleDisconnect = async () => {
		try {
			setLoading(true);
			setError(null);

			// Disconnect from Moon
			console.log('Disconnecting...');
			await disconnect();
			console.log('Disconnected');
			setIsConnected(false);
		} catch (error) {
			console.error('Error during disconnection:', error);
			setError('Error disconnecting from Moon. Please try again.');
		} finally {
			setLoading(false);
		}
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
      functionName: "increment"
    });
    alchemyProvider?.withAlchemyGasManager({
      policyId: process.env.NEXT_PUBLIC_POLICY_ID as string, // replace with your policy id, get yours at https://dashboard.alchemy.com/
    });

    // If gas sponsorship ineligible, baypass paymaster middleware by passing in the paymasterAndData override

    // Empty paymasterAndData indicates that there will be no paymaster involved
    // and the user will be paying for the gas fee even when `withAlchemyGasManager` is configured on the provider

    const elligibility = await alchemyProvider?.checkGasSponsorshipEligibility({
      target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
      data: uoCallData
    });
    console.log(elligibility);
    // if `elligibility` === false, inform users about their ineligibility,
    // either notifying or asking for consent to proceed with gas fee being paid from their account balance

    // To proceed with bypassing the paymster middleware
    const overrides:any = { paymasterAndData: "0x" };

    const uo = await alchemyProvider?.sendUserOperation(
      {
        target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
        data: uoCallData,
      },
      elligibility ? undefined : overrides // for ineligible user operations, set the paymasterAndData override
    );

    const txHash = await alchemyProvider?.waitForUserOperationTransaction(uo!.hash);

    console.log(txHash);
  }

  const decrement = async () => {
        const uoCallData = encodeFunctionData({
      abi: CounterABI.abi,
      functionName: "decrement"
    });
    alchemyProvider?.withAlchemyGasManager({
      policyId: "33354292-10cc-4068-8126-0265735faeff", // replace with your policy id, get yours at https://dashboard.alchemy.com/
    });

    const elligibility = await alchemyProvider?.checkGasSponsorshipEligibility({
      target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
      data: uoCallData
    });
    console.log(elligibility);
    // if `elligibility` === false, inform users about their ineligibility,
    // either notifying or asking for consent to proceed with gas fee being paid from their account balance

    // To proceed with bypassing the paymster middleware
    const overrides:any = { paymasterAndData: "0x" };

    const uo = await alchemyProvider?.sendUserOperation(
      {
        target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
        data: uoCallData,
      },
      elligibility ? undefined : overrides // for ineligible x`Ar operations, set the paymasterAndData override
    );

    const txHash = await alchemyProvider?.waitForUserOperationTransaction(uo!.hash);

    console.log(txHash);
  }

  const tripleIncrement = async () => {
    const uoCallData = encodeFunctionData({
      abi: CounterABI.abi,
      functionName: "increment"
    });
    alchemyProvider?.withAlchemyGasManager({
      policyId: process.env.NEXT_PUBLIC_POLICY_ID as string, // replace with your policy id, get yours at https://dashboard.alchemy.com/
    });

    const elligibility = await alchemyProvider?.checkGasSponsorshipEligibility({
      target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
      data: uoCallData
    });
    console.log(elligibility);
    // if `elligibility` === false, inform users about their ineligibility,
    // either notifying or asking for consent to proceed with gas fee being paid from their account balance

    // To proceed with bypassing the paymster middleware
    const overrides:any = { paymasterAndData: "0x" };

    const uo = await alchemyProvider?.sendUserOperation([
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

    const txHash = await alchemyProvider?.waitForUserOperationTransaction(uo!.hash);

    console.log(txHash);
  }

  const tripleDecrement = async () => {
        const uoCallData = encodeFunctionData({
      abi: CounterABI.abi,
      functionName: "decrement"
    });
    alchemyProvider?.withAlchemyGasManager({
      policyId: process.env.NEXT_PUBLIC_POLICY_ID as string, // replace with your policy id, get yours at https://dashboard.alchemy.com/
    });

    const elligibility = await alchemyProvider?.checkGasSponsorshipEligibility({
      target: "0xB043083EcF02012b58FBCDe05234AB6818334Cc1",
      data: uoCallData
    });
    console.log(elligibility);
    // if `elligibility` === false, inform users about their ineligibility,
    // either notifying or asking for consent to proceed with gas fee being paid from their account balance

    // To proceed with bypassing the paymster middleware
    const overrides:any = { paymasterAndData: "0x" };

    const uo = await alchemyProvider?.sendUserOperation([
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

    const txHash = await alchemyProvider?.waitForUserOperationTransaction(uo!.hash);

    console.log(txHash);
  }
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
      </div>
    </>
  );

const Login = () => {
	return (
		<div className="">
			{!isConnected && (
				<div>
					<h2 className="text-2xl font-bold mb-4 text-center">
						Initialize & Connect to Moon
					</h2>
					<button
						type="button"
						className="bg-blue-500 text-white p-2 rounded"
						onClick={handleInitializeAndConnect}
					>
						{loading ? 'Connecting...' : 'Initialize & Connect to Moon'}
					</button>
					{error && <p className="text-red-500 mt-2">{error}</p>}
				</div>
			)}

			{isConnected && !signupSuccess && !signInSuccess && (
				<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
					<div className="mb-4">
						<h2 className="text-2xl font-bold mb-4 text-center">
							Sign up for a Moon Account
						</h2>
						<input
							type="email"
							placeholder="Email"
							className="w-full border p-2 rounded mb-2"
							value={email}
							onChange={handleEmailChange}
						/>
					</div>
					<div className="mb-4">
						<input
							type="password"
							placeholder="Password"
							className="w-full border p-2 rounded mb-2"
							value={password}
							onChange={handlePasswordChange}
						/>
					</div>
					<div className="mb-4">
						<input
							type="password"
							placeholder="Confirm Password"
							className={`w-full border p-2 rounded mb-2 ${
								passwordError ? 'border-red-500' : ''
							}`}
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
						/>
						{passwordError && (
							<p className="text-red-500 text-xs italic">{passwordError}</p>
						)}
					</div>
					<div className="flex justify-center">
						<button
							type="button"
							className="bg-blue-500 text-white p-2 rounded"
							onClick={handleSignup}
						>
							{loading ? 'Signing up...' : 'Sign up for a Moon Account'}
						</button>
						{error && <p className="text-red-500 ml-2">{error}</p>}
					</div>
				</form>
			)}

			{signupSuccess && !signInSuccess && isConnected && (
				<div className="mb-4 text-center">
					<p>Congratulations! Your Moon account is created.</p>
					<p>Now that you have created an account, sign in.</p>
					<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
						<div className="mb-4">
							<h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
							<input
								type="email"
								placeholder="Email"
								className="w-full border p-2 rounded mb-2"
								value={email}
								onChange={handleEmailChange}
							/>
						</div>
						<div className="mb-4">
							<input
								type="password"
								placeholder="Password"
								className="w-full border p-2 rounded mb-2"
								value={password}
								onChange={handlePasswordChange}
							/>
						</div>
						<div className="flex justify-center">
							<button
								type="button"
								className="bg-blue-500 text-white p-2 rounded"
								onClick={handleSignIn}
							>
								{loading ? 'Signing in...' : 'Sign In'}
							</button>
							{error && <p className="text-red-500 ml-2">{error}</p>}
						</div>
					</form>
				</div>
			)}

			{signInSuccess && isConnected && (
				<div className="mt-4 text-center">
					<p>Authenticated Address: {authenticatedAddress}</p>
					{loggedInView}
					<button
						type="button"
						className="bg-red-500 text-white p-2 rounded mt-2"
						onClick={handleDisconnect}
					>
						{loading ? 'Disconnecting...' : 'Disconnect from Moon'}
					</button>
					{error && <p className="text-red-500 mt-2">{error}</p>}
				</div>
			)}
		</div>
	);}

	return (
		<>
			<Navbar Login={Login}></Navbar>
			<LandingPage />
		</>
	);
};

export default SignupPage;
