import Head from 'next/head'
import {useState, useEffect, useRef} from 'react';
import {providers, ethers} from 'ethers';
import styles from '@/styles/Home.module.css'
import Web3Modal from 'web3modal';



export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);

  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const [ens, setEns] = useState("");

  // Save the address of the currently connected account
  const [address, setAddress] = useState("");
  
  
  const setENSOrAddress = async(addr, web3Provider) => {
     // Lookup the ENS related to the given address
     let _ens = await web3Provider.lookupAddress(addr);

    // If the address has an ENS set the ENS or else just set the address
    if(_ens) {
      setEns(_ens);
    } else {
      setAddress(addr);
    } 
  };

  const getProviderOrSigner = async() => {
    
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const {chainId} = await web3Provider.getNetwork();

    if(chainId !== 5) {
      window.alert("Please Connect to Goerli network");
      throw new Error("Not Connected to Goerli network");
    }

      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

   // Calls the function to set the ENS or Address
      await setENSOrAddress(address, web3Provider);
      return signer;
  }
  

  const connectWallet = async() => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      
      await getProviderOrSigner();
      setWalletConnected(true);

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if(!walletConnected) {
      
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  } , [walletConnected]);


  const renderButton = () => {
    if(walletConnected) {
      <div> Wallet Connected </div>
    } else {
      return (
        <button className={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      );
    }
  };

  

  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className = {styles.title}>
            Welcome to AvantGards club, {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            (A Collection for the Web3 cult)
          </div>
        {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png"/>        
        </div>
      </div>
      <footer className = {styles.footer}>
        Made with 💙 by AvantGard 
      </footer>
  </div>
  )
}
