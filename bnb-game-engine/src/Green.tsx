import '@rainbow-me/rainbowkit/styles.css';
import { useAccount } from 'wagmi';
import './App.css';
import { Demo } from './components/demo';
import { Wallet } from './components/wallet';

function Green() {
  const { isConnected } = useAccount();

  return (
    <>
      <div className='w-100 text-center standard-background px-2 py-2 mb-1'>
        <Wallet />
      </div>
      {isConnected && <Demo />}
    </>
  )
}

export default Green
