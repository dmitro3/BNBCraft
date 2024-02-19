import React from 'react';


function Buy(contractAddress, userAddress) {
  const buyGame = async () => {
    await contractAddress.buyGame()
  }
  
  return (
    <div>
      <h1>Buy The Game</h1>
      <button onClick={() => {
        contractAddress.buyGame()
      }}>Buy</button>
    </div>
  );
}

export default Buy;
