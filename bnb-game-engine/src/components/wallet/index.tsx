import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Wallet = () => {

  return (
    <div className='standard-background'>
      <ConnectButton accountStatus="address" />
    </div>
  );
};
