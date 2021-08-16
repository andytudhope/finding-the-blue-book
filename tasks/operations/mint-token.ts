import { task, types } from "hardhat/config";
import { ContractTransaction } from "ethers";
import { Guardians } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { TASK_MINT } from "../task-names";
// hh mint-token --network mainnet --metadata-uri ar://fGFUzHRDtsHEFuMDefxRD48xx7hIVep8iWVuHi8h_h4
task(TASK_MINT, "Mints a token with token metadata uri")
  .addParam("metadataUri", "The token URI", null, types.string)
  .setAction(async ({ metadataUri }, hre) => {
    const abi = [
      'function safeMint(address to, string metadataURI) public',
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

    const receipt: ContractTransaction = await contract.connect(deployer)
      .safeMint(mintToAddress, metadataUri, { gasLimit: 300000 });

    console.log('minted:', receipt);
    process.exit(0)
  });