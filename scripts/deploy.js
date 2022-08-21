// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.

// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");


async function main() {
  // Nous allons vouloir déployer notre contract nommé TwitterNFT
  const getMyContract = await hre.ethers.getContractFactory("TwitterNFT");
  // Puis le déployer avec notre constructeur qui est notre base URI
  const deployMyContract = await getMyContract.deploy("https://gateway.pinata.cloud/ipfs/QmZKnEaehsYUCvyKhdSjWwWryAMJQQCo7w1qpY8BZT8cHn/");

  await deployMyContract.deployed();

  console.log("Contract deployed to:", deployMyContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
