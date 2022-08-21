import { useState } from "react";
import { ethers } from "ethers";

function App() {

  const [account, setAccount] = useState([]);
  const [error, setError] = useState('');

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await provider.getNetwork();
      if (chainId == 43114) {
        let accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        }); // On viens récupérer les différents comptes qu'il possède
        setAccount(accounts);
      } else {
        setError("Invalid network, switch to Avalanche and try again");
      }
    }
  }
  return (
    <div className="App">
      {
        error ?
          <h4>{error}</h4>
          :
          null
      }
      {account.length > 0 ? (
        <h1>You are connected {account[0]}</h1>
      ) : (
        <button onClick={() => connect()}>Connect via Metamask</button>
      )}
    </div>
  );
}

export default App;
