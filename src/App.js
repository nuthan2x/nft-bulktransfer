import './App.css';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
// import Transferall from './function.js';

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [chainnetwork, setchainnetwork] = useState(undefined);
  const [nftdata, setnftdata] = useState(undefined);
  const [nftowned_contracts, setnftowned_contracts] = useState([]);
  const [txreceipts, settxreceipts] = useState([]);  
  const [transferalltx, settransferalltx] = useState(undefined);
  const [targetaddress, settargetaddress] = useState(undefined);

  useEffect(() => {
    checkIfWalletIsConnected()
    requestnftdata()
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
    setnftowned_contracts(filteredarray)
    console.log('filteredarray: ', filteredarray);
  }

  const BULKtransfer_contract = "0xD223EC434234ee5Bb945Ab8DE9d3564b6098ACba"
  const BULK_ABI =[{"inputs":[{"internalType":"address[]","name":"contracts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"address","name":"_target","type":"address"}],"name":"transferall","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  
  const makeapproval = async() => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        // const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli");
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner();
        const ERC721_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"operator","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]
        
        for (let i = 0; i < nftowned_contracts?.length; i++) {
          try {
            const connectedContract = new ethers.Contract(nftowned_contracts[i],ERC721_ABI,signer);
            const txn = await connectedContract.setApprovalForAll(BULKtransfer_contract,true);
            let receipt = await  txn.wait();
            console.log('receipt: ', receipt);
            settxreceipts(prev => [...prev,txn]);
          } catch(error) {
            console.log(error)
            break;
          }
         
        }
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const bulktransfer = async () => {
    try {
      const { ethereum } = window;
      let contractsarray = []
      let idarray = []
      
      nftdata?.map(nft => {
        contractsarray.push(nft.contract_address);
        idarray.push(nft.token_id)
      })
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(BULKtransfer_contract,BULK_ABI,signer);

        console.log('idarray: ', idarray);
        console.log('contractsarray: ', contractsarray);
        console.log(targetaddress)
          try {
            const txn = await connectedContract.transferall(contractsarray,idarray,targetaddress);
            let receipt = await  txn.wait();
            settransferalltx(txn);
            console.log('receipt: ', receipt);
          } catch(error) {
            console.log(error)
          }

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="App">
      <header className="App-header">
       <button onClick={connectWallet}> {currentAccount ?  `${currentAccount.slice(0,6)}......${currentAccount.slice(-6)}` :"connectWallet" }</button>
       <form action="">
       <label htmlFor="">target : </label>
        <input type="text" placeholder='address' onChange={e => settargetaddress(e.target.value)}/>
       </form>
      </header>
      {/* <Transferall nftowned_contracts = {nftowned_contracts} nftdata= {nftdata}/> */}
      <div className="App-body">
        <button className="approveall" onClick={makeapproval}>
            approveall
        </button>
        <button className="transferall" onClick={bulktransfer}>
            transferall
        </button>
    </div>
    </div>
  );
}

export default App;
