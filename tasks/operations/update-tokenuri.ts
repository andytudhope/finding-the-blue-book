import { task, types } from "hardhat/config";
import { ContractTransaction } from "ethers";
import { Guardians } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { TASK_UPDATETOKENURI } from "../task-names";
// npx hardhat update-tokenuri --network goerli --token-id 0 --metadata-uri ar://WbxzF2cys_GLFpg9HMa8VdlArwJ-OjBA-T5YxY0C7c0
task(TASK_UPDATETOKENURI, "Updates a token with a new metadata uri")
  .addParam("tokenId", "The token id", null, types.int) 
  .addParam("metadataUri", "The token URI", null, types.string)
  .setAction(async ({ tokenId, metadataUri }, hre) => {
    const abi = [
      'function updateTokenURI(uint256 _id, string _uri) public',
    ]

    if (!metadataUri.startsWith("ar://")) {
      console.log('metadata-uri must begin with ar://');
      process.exit(0)
    }
    console.log('mintTokenURI:', metadataUri)

    let deployer: SignerWithAddress;

    [deployer] = await hre.ethers.getSigners();
    const address = await deployer.getAddress();
    console.log(`deployer address: ${address}`);

    const network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    var contractAddress = "";
    if (network.name === "goerli") {
      contractAddress = process.env.GOERLI_CONTRACT_ADDRESS || '';
    } else if (network.name === "homestead") {
      contractAddress = process.env.MAINNET_CONTRACT_ADDRESS || '';
    } else if (network.name === "unknown") { //localhost network
      contractAddress = process.env.LOCALHOST_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${contractAddress}`);

    const contract: Guardians = new hre.ethers.Contract(contractAddress, abi, deployer) as Guardians;

    const receipt: ContractTransaction = await contract.connect(deployer)
      .updateTokenURI(tokenId, metadataUri, { gasLimit: 300000 });

    console.log('token URI updated:', receipt);
    process.exit(0)
  });