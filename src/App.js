import './App.css';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Transferall from './function.js';

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [chainnetwork, setchainnetwork] = useState(undefined);
  const [nftdata, setnftdata] = useState(undefined);
  const [nftowned_contracts, setnftowned_contracts] = useState([]);
  

  const CONTRACT_ADDRESS = '';
  const ABI = 

  useEffect(() => {
    checkIfWalletIsConnected()
  }, []);

  useEffect(() => {
    console.log('nftdata: ', nftdata);
    nftcontractsowned()
  }, [nftdata]);



  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = ethers.utils.getAddress(accounts[0]);
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      console.log(currentAccount,"current address");
     

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
    
      const goerliChainId = "0x5"; 
      if (chainId !== goerliChainId) {
       alert("You are not connected to the Goerli Test Network!");
      }else{
        setchainnetwork("Goerli")
      }
    } else {
      console.log("No authorized account found");
    }
  }

  
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
    
      const goerliChainId = "0x5"; 
      if (chainId !== goerliChainId) {
       alert("You are not connected to the Goerli Test Network!");
      }

      
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      requestnftdata()
      nftcontractsowned()
    } catch (error) {
      console.log(error);
    }
    
  }

  const options = {
    method: 'GET',
    url: 'https://api.nftport.xyz/v0/accounts/0x78351284f83A52b726aeEe6C2ceBBe656124434c',
    params: {chain: 'goerli'},
    headers: {
      'Content-Type': 'application/json',
      Authorization: '58d75fec-de0b-427c-985a-2f7ee9c83e21'
    }
    //https://docs.nftport.xyz/docs/nftport/b3A6MjE0MDYzNzM-retrieve-nf-ts-owned-by-an-account      (=>>>>> API provider)
  };
  
  const requestnftdata =  () => {
      axios.request(options).then(function (response) {
        let data = response.data
      setnftdata(data.nfts);
      // console.log(nftdata);
    }).catch(function (error) {
      console.error(error);
    });
  }

  const nftcontractsowned = () => {
    let contractarray = []
    for (let i = 0; i < nftdata?.length; i++) {

     let currentnft = nftdata[i].contract_address;
     contractarray.push(currentnft);  
    }

    let filteredarray = [] 
    for (let j = 0; j < contractarray?.length; j++) {
      contractarray[j] !== contractarray[j - 1] && filteredarray.push(contractarray[j])
    }
    
    // console.log('nftowned_contracts: ', contractarray);
    console.log('filteredarray: ', filteredarray);
  }


  return (
    <div className="App">
      <header className="App-header">
       <button onClick={connectWallet}> {currentAccount ?  `${currentAccount.slice(0,6)}......${currentAccount.slice(-6)}` :"connectWallet" }</button>
      </header>
      <Transferall nftowned_contracts = {nftowned_contracts} nftdata= {nftdata}/>
    </div>
  );
}

export default App;
