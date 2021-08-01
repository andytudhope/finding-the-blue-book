import { ethers } from "hardhat";
import chai from "chai";
import { Guardians__factory, Guardians } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const { expect } = chai;

let guardian: Guardians;
let guardianFactory: Guardians__factory;
let deployer: SignerWithAddress;
let other: SignerWithAddress;

const PROXY_REGISTRATION_ADDRESS = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

describe("guardian", () => {

    beforeEach(async () => {
        [deployer, other] = await ethers.getSigners();
        guardianFactory = (await ethers.getContractFactory(
            'Guardians',
            deployer
        )) as Guardians__factory;

        guardian = (await guardianFactory.deploy(PROXY_REGISTRATION_ADDRESS)) as Guardians;
        expect(guardian.address).to.properAddress;
    });

    describe("deploying", async () => {
        it('deployer is owner', async () => {
            expect(await guardian.owner()).to.equal(deployer.address);
        });

        it("has expected name and symbol", async function () {
            expect(await guardian.name()).to.equal("Guardians");
            expect(await guardian.symbol()).to.equal("GUARD");
        });
    });

    describe("minting", async () => {
        it('contract owner can mint tokens', async () => {
            const tokenId = ethers.BigNumber.from(0);
            const tokenURI = "https://eth.iwahi.com/1df0";

            await expect(guardian.connect(deployer).safeMint(other.address, tokenURI))
                .to.emit(guardian, 'Transfer')
                .withArgs(ZERO_ADDRESS, other.address, tokenId);

            await expect(guardian.connect(deployer).setTokenURI(tokenId, tokenURI));

            await expect(guardian.connect(other).setTokenURI(tokenId, tokenURI))
                .to.be.revertedWith('Ownable: caller is not the owner');

            expect(await guardian.balanceOf(other.address)).to.equal(1);
            expect(await guardian.ownerOf(tokenId)).to.equal(other.address);
            expect(await guardian.tokenURI(tokenId)).to.equal(tokenURI);
        });

        it('other accounts cannot mint tokens', async () => {
            const tokenURI = "https://eth.iwahi.com/2d3a";
            await expect(guardian.connect(other).safeMint(other.address, tokenURI))
                .to.be.revertedWith('Ownable: caller is not the owner');
        });
    });

    describe("updating", async () => {
        it('update tokenURI works as expected', async() => {
            const tokenId = ethers.BigNumber.from(0);
            const tokenURI = "https://eth.iwahi.com/1xf0";
            const newTokenURI = "https://eth.iwahi.com/1yf0";
    
            await expect(guardian.connect(deployer).safeMint(other.address, tokenURI))
                .to.emit(guardian, 'Transfer')
                .withArgs(ZERO_ADDRESS, other.address, tokenId);
            
            await expect(guardian.connect(other).updateTokenURI(tokenId, newTokenURI))
                .to.emit(guardian, 'TokenURIUpdated')
                .withArgs(tokenId, newTokenURI);

            await expect(guardian.connect(deployer).updateTokenURI(tokenId, newTokenURI))
                .to.be.revertedWith('ERC721Tradable: caller is not the owner of this token');
        });
    });            

    describe("burning", async () => {
        it('holders can burn their tokens', async () => {
            const tokenId = ethers.BigNumber.from(0);
            const tokenURI = "https://eth.iwahi.com/e01b";

            await expect(guardian.connect(deployer).safeMint(other.address, tokenURI))
                .to.emit(guardian, 'Transfer')
                .withArgs(ZERO_ADDRESS, other.address, tokenId);

            await expect(guardian.connect(other).burn(tokenId))
                .to.emit(guardian, 'Transfer')
                .withArgs(other.address, ZERO_ADDRESS, tokenId);
            expect(await guardian.balanceOf(other.address)).to.equal(0);
            await expect(guardian.ownerOf(tokenId))
                .to.be.revertedWith('ERC721: owner query for nonexistent token');
            expect(await guardian.totalSupply()).to.equal(0);
        });

        it('cannot burn if not token owner', async () => {
            const tokenId = ethers.BigNumber.from(0);
            const tokenURI = "https://eth.iwahi.com/e01b";

            await expect(guardian.connect(deployer).safeMint(other.address, tokenURI))
                .to.emit(guardian, 'Transfer')
                .withArgs(ZERO_ADDRESS, other.address, tokenId);

            await expect(guardian.connect(deployer).burn(tokenId))
                .to.be.revertedWith('function call to a non-contract account');

            expect(await guardian.balanceOf(other.address)).to.equal(1);
            expect(await guardian.totalSupply()).to.equal(1);
        });
    });
});


