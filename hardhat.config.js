require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const { privateKey,APIKey,URLINFURA } = require('./secrets.json');
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 // Replace this private key with your Ropsten account private key
 // To export your private key from Metamask, open Metamask and
 // go to Account Details > Export Private Key
 // Be aware of NEVER putting real Ether into testing accounts

 
 module.exports = {
   solidity: {
     version :"0.8.11",
     settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
   paths:{
    artifacts: "./src/artifacts"
    },
    networks: {
      rinkeby: {
          url: URLINFURA,
          accounts: [privateKey]
      }
    },
    etherscan: {
      // Your API key for Etherscan
      // Obtain one at https://etherscan.io/
      apiKey: APIKey
    }
 };