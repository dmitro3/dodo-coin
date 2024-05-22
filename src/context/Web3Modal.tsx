
// context/index.tsx

'use client'

import React, { ReactNode } from 'react'
import { config, projectId } from '@/config'

import { createWeb3Modal } from '@web3modal/wagmi/react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { State, WagmiProvider } from 'wagmi'

// Setup queryClient
const queryClient = new QueryClient()

if (!projectId) throw new Error('90e5e5ac9da57364effebface3c64405')

// Create modal
createWeb3Modal({
	wagmiConfig: config,
	projectId,
	enableAnalytics: true, // Optional - defaults to your Cloud configuration
	enableOnramp: true // Optional - false as default
})

export default function Web3ModalProvider({
									  children,
									  initialState
								  }: {
	children: ReactNode
	initialState?: State
}) {
	return (
		<WagmiProvider config={config} initialState={initialState}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	)
}
