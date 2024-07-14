
// config/index.tsx

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import * as CHAINS from 'wagmi/chains'

// Your WalletConnect Cloud project ID
export const projectId = '90e5e5ac9da57364effebface3c64405'

// Create a metadata object
const metadata = {
	name: 'dodo-coin',
	description: 'Web3Modal Example',
	url: 'https://web3modal.com', // origin must match your domain & subdomain
	icons: ['https://avatars.githubusercontent.com/u/37784886'],

}


const chains = Object.values(CHAINS) as (typeof CHAINS.base)[]

export const config = defaultWagmiConfig({
	chains: [
		//@ts-ignore
		...chains,
		{
			id: 65,
			name: "OKEX TESTNET",
			rpcUrls: {
				default: { http: ['https://exchaintestrpc.okex.org/'] },
			}
		}
	],
	projectId,
	metadata,
	ssr: true,
	enableInjected: true,
	enableWalletConnect: true,
	storage: createStorage({
		storage: cookieStorage
	}),

})
