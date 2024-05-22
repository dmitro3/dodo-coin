
// config/index.tsx

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

// Your WalletConnect Cloud project ID
export const projectId = '90e5e5ac9da57364effebface3c64405'

// Create a metadata object
const metadata = {
	name: 'dodo-coin',
	description: 'Web3Modal Example',
	url: 'https://web3modal.com', // origin must match your domain & subdomain
	icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
const chains = [mainnet, sepolia] as const
export const config = defaultWagmiConfig({
	chains,
	projectId,
	metadata,
	ssr: true,
	storage: createStorage({
		storage: cookieStorage
	})
})
