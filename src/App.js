import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contract from './AuctionContract.json';
import eggImg from './egg.png';
var countMint = 10;
const axios = require('axios');
const fs = require('fs');

const contractAddress = "0x84E492378aC7A8f41CA7F21EBb3195cb3778c002";//prod : 0x52c4E553791B249435e25aed9d3b9f19da22154f
const abi = contract.abi;

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [bid, setBid] = useState("");
  const [currentBid, setcurrentBid] = useState("");
  const [startAuction, setstartAuction] = useState("");

  const checkNewBid = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress,abi,signer);
        nftContract.on("Bidders", (from, amount) => {
          if(currentBid!=amount)setcurrentBid(amount)
          console.log( amount, from);
        });
      }
    } catch(err) {
      console.log(err)
    }
  }

  const checkWalletIsConnected = async () => {
    const {ethereum} = window;

    if(!ethereum){
      console.log("ethereum not installed")
    }
    
    const accounts = await ethereum.request({method:'eth_requestAccounts'});
    if(accounts.length !== 0){
      const account = accounts[0]
      setCurrentAccount(account)
    }
    try{
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress,abi,signer);
        setcurrentBid(await nftContract.getParamsContract("bid"))
        setstartAuction(await nftContract.getParamsContract("startAuction"))
      }
    } catch(err) {
      console.log(err)
    }
  }

  const connectWalletHandler = async () => {
    const {ethereum} = window;

    try {
      const accounts = await ethereum.request({method:'eth_requestAccounts'});
      setCurrentAccount(accounts[0]);
    } catch(err){
      console.log(err)
    }
  }

  const bidding = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress,abi,signer);
        let nftTxn = await nftContract.bidding({value: ethers.utils.parseEther(bid)})

      }
    } catch(err) {
      console.log(err)
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const salesEnd = () => {
    if(startAuction.toString()==="0"){
      return (<p className='italic'>sales not started</p>)
    }else if(Date.now()>(startAuction*1000)+600000){
      return (<p className='italic'>sales ended !</p>)
    }else{
      let date = (new Date((startAuction*1000)+600000));
      return (<p className='italic'>sales end {date.toLocaleDateString('en-US')}  {date.toLocaleTimeString('en-US')}</p>)
    }
  }

  const startEndAuction = () =>{
    if(startAuction.toString()==="0"){
      return <button onClick={startAuctionCall}>Start Auction</button>
    }else if(Date.now()>(startAuction*1000)+600000){
      return <button onClick={completeAuctionCall}>Complete Auction</button>
    }
  }

  const startAuctionCall = async () => { 
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress,abi,signer);
        await nftContract.startAuction().then(()=>{
          setstartAuction((Date.now())/1000)
        })
      }
    } catch(err) {
      console.log(err)
    }
  }

  const completeAuctionCall = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress,abi,signer);
        nftContract.endAuction().then(()=>{
          //setstartAuction((Date.now()+300000)/1000)
        })
      }
    } catch(err) {
      console.log(err)
    }
  }

  const buildMetaData = async (number) =>{
    return {pinataMetadata: { name: number+".json" }, pinataContent: {"name":"ARKAN #"+number,"description":"Arkan are mystical and tame creatures that can be reproduced ad infinitum","image":"ipfs://QmeSDPcWZ68CUatCzPSw9JJRvrRK11PZGnUK2qMWzkWwMi/0.png","edition":0,"seller_fee_basis_points":250,"collection":{"name":"NYXIES","family":"EGGS"},"symbol":"ARKN","properties":{"files":[{"uri":"ipfs://QmeSDPcWZ68CUatCzPSw9JJRvrRK11PZGnUK2qMWzkWwMi/"+number+".png","type":"image/png"}],"category":"image","creators":[{"address":"0x0cE1A376d6CC69a6F74f27E7B1D65171fcB69C80","share":100}]},"attributes":[{"trait_type":"egg","value":1},{"trait_type":"ears","value":"Uncommon"},{"trait_type":"horn","value":"Uncommon"},{"trait_type":"mouth","value":"Curiosity"},{"trait_type":"eyes","value":"Rare"}]}}
  }

  const lazyMint = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress,abi,signer);
        nftContract.mintDelegate({value: "100000000000000000"}).then(()=>{
          uploadFile(countMint);
        })
      }
    } catch(err) {
      console.log(err)
    }
  }

  const withdraw = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress,abi,signer);
        nftContract.withdraw()
      }
    } catch(err) {
      console.log(err)
    }
  }

  const payRoyalties = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress,abi,signer);
        nftContract.payRoyalties()
      }
    } catch(err) {
      console.log(err)
    }
  }

  const deposit = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress,abi,signer);
        nftContract.deposit("100000000000000000",{value: "100000000000000000"})
      }
    } catch(err) {
      console.log(err)
    }
  }

  const uploadFile = async (number) => {

    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios.post(url, buildMetaData(number) , {
      headers: {
        pinata_api_key: "d388698d1f1fb05a02c4",
        pinata_secret_api_key: "ae7f4fdf26e65a2b29a1bbdecef4336905098c9039e726acfd383744c8ab38df"
      }
    })
  };

  const currentBidPrice = () => {
      return (<div className='current-price'>current bid price {currentBid/1000000000000000000} eth</div>)
  }

  useEffect(() => {
    checkWalletIsConnected();
    checkNewBid();
  }, [])


  return (
    <div>
      {startEndAuction()}
      <button onClick={lazyMint}>Lazy Mint</button>
      <button onClick={withdraw}>Withdraw</button>
      <button onClick={deposit}>deposit</button>
      
      <div className="column">

        <div className='left-side'>
          <h1>ARKAN</h1>
          {salesEnd()}
          <h2>Collectibles eggs</h2>
          <p>10 first NFT</p>
          <p className='italic'>user needs Metamask to participate auction</p>
          {currentBidPrice()}
          <input placeholder="enter amount..."  value={bid} onChange={e => setBid(e.target.value)}/>
          <button onClick={bidding}>BID</button>
        </div>

        <div className='right-side'>
          {connectWalletButton()}
          <img src={eggImg} ></img>
        </div>
      </div>
    </div>
  )
}

export default App;