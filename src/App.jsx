import './App.css';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3 from 'web3';

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [nftdata, setnftdata] = useState(undefined);
  const [nftowned_contracts, setnftowned_contracts] = useState([]);
  const [nftownedids, setnftownedids] = useState([]);
  const [allcontractsarray, setallcontractsarray] = useState([]);
  const [targetaddress, settargetaddress] = useState(undefined);

  useEffect(() => {
    checkIfWalletIsConnected()
    requestnftdata()
  }, [currentAccount]);

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
      setCurrentAccount(account);
     

      let chainId = await ethereum.request({ method: 'eth_chainId' });
    
      const goerliChainId = "0x5"; 
      if (chainId !== goerliChainId) {
       alert("You are not connected to the Goerli Test Network!");
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
    
      const goerliChainId = "0x5"; 
      if (chainId !== goerliChainId) {
       alert("You are not connected to the Goerli Test Network!");
      }

      
      setCurrentAccount(accounts[0]); 
      requestnftdata()
      nftcontractsowned()
    } catch (error) {
      console.log(error);
    }
    
  }

  const options = {
    method: 'GET',
    url: `https://deep-index.moralis.io/api/v2/${currentAccount}/nft`,
    params: {chain: 'goerli', format: 'decimal'},
    headers: {
      accept: 'application/json',
      'X-API-Key': "OALLEXDPSYlwQ7u2A67gUCAY0TRLM5yjAVdjwHApeS1bnAlD03keIq9KpJDi8sG7"
    }
  };

  const requestnftdata =  () => {
    axios
      .request(options)
      .then(function (response) {
        let data = response.data
        setnftdata(data.result);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  const nftcontractsowned = () => {
    let contractarray = []
    for (let i = 0; i < nftdata?.length; i++) {

    let currentnft = Web3.utils.toChecksumAddress(nftdata[i].token_address);
     contractarray.push(currentnft);  
    }

    let allcontractsarray = []   
    for (let index = 0; index < nftdata?.length; index++) {
      allcontractsarray.push(Web3.utils.toChecksumAddress(nftdata[index].token_address));
    }
    
    let filteredarray = []
    // const [head, ...tail] = nftdata

    // const output = tail.reduce( 
    //   (prev, current) => {
    //     if (!prev.map(o => o.token_address).includes(current.token_address)) {
    //       prev.push(current)
    //     }
    //     return prev
    //   },
    //   [head]
    // )
    // console.log('output: ', output);
    let only_contractarray = []  
    

      for (let i = 0; i < nftdata?.length; i++) {
        only_contractarray.push(Web3.utils.toChecksumAddress(nftdata[i].token_address));
        
      }

      // for (let i = 0; i < nftdata?.length; i++) {
      //   let currentcontract = nftdata[i].token_address;
      //   for (let j = 0; j < only_contractarray?.length; j++) {
      //     if (i !== j) {
      //       if(currentcontract === only_contractarray[j]) {
      //         only_contractarray[i] = 0
      //         indexes.push(i)
      //       } 
      //     }
          
      //   }
        
      // }
      const sortedarray = only_contractarray.sort().reverse()
      console.log('sortedarray: ', sortedarray);
 
    

    let refilter = []
    for (let k = 0; k < only_contractarray?.length; k++) {
      if(only_contractarray[k] !== only_contractarray[k + 1]) {
        refilter.push(only_contractarray[k])
      }
      
    }
    console.log('refilter: ', refilter);
    // for (let p = 0; p < output?.length; p++) {
    //   refilter.push(Web3.utils.toChecksumAddress(output[p].token_address))
    // }
    filteredarray = refilter;


    let filtered_idarray = []
    for (let k = 0; k < contractarray?.length; k++) {
      filtered_idarray.push(nftdata[k].token_id)
    }
    
   

    setallcontractsarray(allcontractsarray);
    setnftowned_contracts(filteredarray);
    setnftownedids(filtered_idarray);
    console.log('filteredarray: ', filteredarray);
  }

  const BULKtransfer_contract = "0xd6476EF3a78278609d4F07954C9554AF2C201Af4"
  const BULK_ABI =[{"inputs":[{"internalType":"address[]","name":"contracts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"address","name":"_target","type":"address"}],"name":"transferall","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  const makeapproval = async() => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner();
        const ERC721_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"operator","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]
        
        for (let i = 0; i < nftowned_contracts?.length; i++) {
          try {
            const connectedContract = new ethers.Contract(nftowned_contracts[i],ERC721_ABI,signer);
            const txn = await connectedContract.setApprovalForAll(BULKtransfer_contract,true);
            console.log(`approve ${i} `, `https://goerli.etherscan.io/tx/${txn.hash}`);
            let receipt = await  txn.wait();
            console.log('receipt: ', receipt);
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
     

      if (ethereum) {
        await makeapproval()

        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(BULKtransfer_contract,BULK_ABI,signer);

        console.log('idarray: ', nftownedids);
        console.log('contractsarray: ', allcontractsarray);
        console.log(targetaddress)
          try {
            const txn = await connectedContract.transferall(allcontractsarray,nftownedids,targetaddress);
            console.log('bulktransaction: ', `https://goerli.etherscan.io/tx/${txn.hash}`  );
            let receipt = await  txn.wait();
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
      <div className="App-body">
        {/* <button className="approveall" onClick={makeapproval}>
            approveall
        </button> */}
        <button className="transferall" onClick={bulktransfer}>
            transferall
        </button>
    </div>
    </div>
  );
}

export default App;
