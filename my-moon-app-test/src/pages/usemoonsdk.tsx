import { CreateAccountInput } from '@moonup/moon-api';
import { MoonSDK } from '@moonup/moon-sdk';
import * as _ from '@moonup/ethers';

import { AUTH, MOON_SESSION_KEY, Storage } from '@moonup/moon-types';
import { useState,useEffect } from 'react';

export const useMoonSDK = () => {
	const [moon, setMoon] = useState<MoonSDK | null>(null);
	const [moonProvider, setMoonProvider] = useState<_.MoonProvider | null>(null);
	const [moonSigner, setMoonSigner] = useState<_.MoonSigner | null>(null);

	
	

	const initialize = async () => {
		const moonInstance = new MoonSDK({
			Storage: {
				key: MOON_SESSION_KEY,
				type: Storage.SESSION,
			},
			Auth: {
				AuthType: AUTH.JWT,
			},
		});
		const config = {
				Storage: {
					key: MOON_SESSION_KEY,
					type: Storage.SESSION,
				},
				Auth: {
					AuthType: AUTH.JWT,
				},
			}
		const options: _.MoonProviderOptions = {
			chainId: 1,
		};
		setMoon(moonInstance);
		moonInstance.connect();
	};

	const connect = async () => {
		if (moon) {
			return moon.connect();
		}
	};

	const updateToken = async (token: string, refreshToken: string) => {
		if (moon) {
			moon.updateToken(token);
			moon.updateRefreshToken(refreshToken);

			moon.connect();
		}
	};

	const createAccount = async () => {
		if (moon) {
			const data: CreateAccountInput = {};
			const newAccount = await moon?.getAccountsSDK().createAccount(data);
			return newAccount;
		}
	};

	const disconnect = async () => {
		if (moon) {
			await moon.disconnect();
			sessionStorage.removeItem(MOON_SESSION_KEY);
			setMoon(null);
		}
	};

	return {
		moon,
		moonSigner,
		moonProvider,
		initialize,
		connect,
		updateToken,
		createAccount,
		disconnect,
	};
};
