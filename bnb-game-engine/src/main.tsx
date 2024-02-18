import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './engine/App.jsx'

// Bootstrap & Bootstrap Icons
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './index.css'
import { WagmiConfig, createConfig } from 'wagmi'
import { RainbowKitProvider, connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { chains, publicClient, webSocketPublicClient } from './config/wallet.ts'

const projectId = 'ed56178e1929b6bbda00ad376c71c7a2';
const { wallets } = getDefaultWallets({
  projectId,
  appName: 'bnb-game-engine',
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  webSocketPublicClient,
  publicClient,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider modalSize="compact" chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)
