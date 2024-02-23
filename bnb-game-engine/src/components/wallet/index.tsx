import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Wallet = () => {

  return (
    <div className='standard-fbutton'>
      <ConnectButton accountStatus="address" />
    </div>
  );
};
