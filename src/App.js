import { useState, useEffect } from "react";
import { ethers } from "ethers";

import NFTabi from "./abi/NFTabi.json"


import img from "./img/36.png"
const NFTSmartContract = "0xbe9fe2a28d7d1cc3110f8f539b1e322772474364"

function App() {

  const [account, setAccount] = useState([]);
  const [error, setError] = useState('');
  const [price, setPrice] = useState()
  const [contractError, setContractError] = useState()
  const [mintNumber, setMintNumber] = useState()

  const [totalSupply, setTotalSupply] = useState()
  useEffect(() => {
    getPrice();
    getTotalSupply();
  }, [])

  async function getPrice() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(NFTSmartContract, NFTabi, provider);
      try {
        const data = await contract.nftPrice();
        setPrice(data.toString());
      }
      catch (err) {
        setError(error.error.message);
      }
    }
  }

  async function getTotalSupply() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(NFTSmartContract, NFTabi, provider);
      try {
        const data = await contract.totalSupply();
        setTotalSupply(data.toString());
      }
      catch (error) {
        setError(error.error.message);
      }
    }
  }

  async function mint() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // Création de la constante contract qui nous permet de récupérer les fonctions de notre contrat afin de les appeler plus tard
      const contract = new ethers.Contract(NFTSmartContract, NFTabi, signer);

      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      try {
        let overrides = {
          from: account[0],
          value: (price * mintNumber).toString(), //Ici nous multiplions le prix d'un NFT * le nombre d'nft que l'on veux mint
        };
        const transaction = await contract.mint( //Nous appelons la fonction mint de notre smart contract et y renseignons les 
          //                                         paramètres suivants : 
          account[0], // L'adresse qui va recevoir le/les NFT
          mintNumber, // le nombre n'NFT mint
          overrides // le tableau ci dessus overrides
        );
        await transaction.wait();
      } catch (error) {
        setContractError(error.error.message); // si il y'a une erreure (comme le max per wallet atteint par exemple on retourner cette erreur)
      }
    }
  }

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await provider.getNetwork();
      if (chainId === 4) {
        let accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        }); // On viens récupérer les différents comptes qu'il possède
        setAccount(accounts);
      } else {
        setError("Invalid network, switch to Rinkeby and try again");
      }
    }
  }

  return (
    <div className="App">
      {
        error ?
          <h5 className="error">{error}</h5>
          :
          null
      }
      {account.length > 0 ? (
        <div>
          <h1>You are connected {account[0]}</h1>
          <img src={img} />
          <p>{totalSupply}/50</p>
          {
            contractError ?
              <h4 className="error">{contractError}</h4>
              :
              null
          }
          <button onClick={() => mint()}>Mint</button>
          <input
            type="number"
            max="3"
            min="1"
            onChange={(e) => setMintNumber(e.target.value)}
            value={mintNumber}
          />
        </div>
      ) : (
        <button onClick={() => connect()}>Connect via Metamask</button>
      )}
    </div>
  );
}

export default App;
