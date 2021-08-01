import { task, types } from "hardhat/config";
import { ContractTransaction } from "ethers";
import { Guardians } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { TASK_UPDATETOKENURI } from "../task-names";

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
    let NFTOwner: SignerWithAddress;

    [deployer, NFTOwner] = await hre.ethers.getSigners();
    const address = await deployer.getAddress();
    console.log(`deployer address: ${address}`);

    const network = await hre.ethers.provider.getNetwork();
    console.log(`network: ${network.name}`);

    var contractAddress = "";
    if (network.name === "rinkeby") {
      contractAddress = process.env.RINKEBY_CONTRACT_ADDRESS || '';
    } else if (network.name === "homestead") {
      contractAddress = process.env.MAINNET_CONTRACT_ADDRESS || '';
    } else if (network.name === "unknown") { //localhost network
      contractAddress = process.env.LOCALHOST_CONTRACT_ADDRESS || '';
    }
    console.log(`contractAddress: ${contractAddress}`);

    const mintToAddress = process.env.MINT_TO_ADDRESS || '';
    console.log(`mintToAddress: ${mintToAddress}`);

    const contract: Guardians = new hre.ethers.Contract(contractAddress, abi, deployer) as Guardians;

    // TODO: this is weird. Only the mintToAddress should be able to update the tokenURI,
    // yet currently this works on my local network and I don't know why?
    // Also, if I substitute mintToAddress instead of deployer, I get an error:
    // "VoidSigner cannot sign transactions".
    const receipt: ContractTransaction = await contract.connect(deployer)
      .updateTokenURI(tokenId, metadataUri, { gasLimit: 300000 });

    console.log('token URI updated:', receipt);
    process.exit(0)
  });