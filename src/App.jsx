import { React, useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [myMessage, setMyMessage] = useState(<h3> LOADING.. </h3>);
  const [myDetails, setMyDetails] = useState({
    name: 'none',
    address: 'none',
    balance: 0,
    //frozenBalance: 0,
    network: 'none',
    link: 'false',
  });

  //getBalance Method 
  const getBalance = async () => {
    //if wallet is installed & logged, getting TRX token balance 
    if (window.tronWeb && window.tronWeb.ready) {
      let walletBalances = await window.tronWeb.trx.getAccount(
        window.tronWeb.defaultAddress.base58
      );
      return walletBalances;

    } else {
      return 0;
    }
  };

  //getWalletDetails  Method 
  const getWalletDetails = async () => {
    if (window.tronWeb) {
      //checking if wallet injected 
      if (window.tronWeb.ready) {
        let tempBalance = await getBalance();
        //  let tempFrozenBalance = 0;

        if (!tempBalance.balance) {
          tempBalance.balance = 0;
        }

        //checking if any frozen balance exists 
        /**
        if (
          !tempBalance.frozen &&
          !tempBalance.account_resource.frozen_balance_for_energy
        ) {
          tempFrozenBalance = 0;
        } else {
          if (
            tempBalance.frozen &&
            tempBalance.account_resource.frozen_balance_for_energy
          ) {
            tempFrozenBalance =
              tempBalance.frozen[0].frozen_balance +
              tempBalance.account_resource.frozen_balance_for_energy
                .frozen_balance;
          }
          if (
            tempBalance.frozen &&
            !tempBalance.account_resource.frozen_balance_for_energy
          ) {
            tempFrozenBalance = tempBalance.frozen[0].frozen_balance;
          }
          if (
            !tempBalance.frozen &&
            tempBalance.account_resource.frozen_balance_for_energy
          ) {
            tempFrozenBalance =
              tempBalance.account_resource.frozen_balance_for_energy
                .frozen_balance;
        }
        }*/

        //we have a wallet and we are logged in 
        setMyMessage(<h3>Wallet Connected</h3>);
        setMyDetails({
          name: window.tronWeb.defaultAddress.name,
          address: window.tronWeb.defaultAddress.base58,
          balance: tempBalance.balance / 1000000,
          //frozenBalance: tempFrozenBalance / 1000000,
          network: window.tronWeb.fullNode.host,
          link: 'true',
        });
      } else {
        //we have a wallet and we are not logged in  
        setMyMessage(<h3>Wallet Detected Please Log In</h3>);
        setMyDetails({
          name: 'none',
          address: 'none',
          balance: 0,
          //frozenBalance: 0,
          network: 'none',
          link: 'false',
        });
      }
    } else {
      //wallet is not Detected at all 
      setMyMessage(<h3>WALLET NOT DETECTED</h3>);
    }
  };

  //using useEffect Hook to set walletChecking Interval 
  useEffect(() => {
    const interval = setInterval(async () => {
      getWalletDetails();
      //wallet checking interval 2sec 
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div className="App">
      <div className="Card">
        <h1> TRON WALLET REACT INTEGRATION</h1>
        <div className='Stats'>
          {myMessage}
          <h4>Account Name: {myDetails.name} </h4>
          <h4>My address: {myDetails.address} </h4>
          <h4> Balance: {myDetails.balance} TRX) </h4>
          <h4>network Selected: {myDetails.network}</h4>
          <h4>Link Established: {myDetails.link}</h4>
        </div>
        <footer>
          <p> 2022 @Clinton_eth</p>
        </footer>
      </div>
    </div>
  );
}
