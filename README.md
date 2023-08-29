# Finding The Blue Book

Welcome to the fifth, final, and infinite part of The Blue Book trilogy. 

Rather than being written, this version has been found in the [libraryofbabel.info](https://libraryofbabel.info), where all possible pages of 3200 characters (using latin letters, a space, a comma and period) have already been written. Read that sentence again. Every possible page. It's all in there. Of course, most of the library is unintelligble, so in order to find this book, I had to write it. But I was only writing what already exists.

In truth, this authorial question is perpetually open. So, each chapter has a "Guardian NFT", which I have given to people I love. This NFT can be used to change the html file which displays where the blue book has been found. The range of possible alterations to where the blue book is found is therefore as infinite as each guardian's innate creative potential.

I mean to create sacred economic space. Technologies like Ethereum bind financial value to every speech act. This means we can create ceremonial transaction types where every economic agent is also an artist by virtue of how they choose to express the value of their gifts. Ownership of a Guardian NFT is one such type, because any transaction you initiate with it - changing this site, selling it, doing absolutely nothing - is itself an artisitic statement.

## The Never-Ending Story

The story is simple. 

1. I make Guardian NFTs and give them to people I love.
2. I adapted [Holly Grimm's](https://github.com/Dynamiculture/neurapunks-contract) wonderful Neurapunks NFT contract to ensure [Guardians can update](https://github.com/andytudhope/finding-the-blue-book/blob/main/contracts/ERC721Tradable.sol#L68) the `tokenURI` which stores the metadata for each NFT.
3. I set the `external_url` in the metadata of those NFTs to an Arweave page where I have uploaded the html file.
4. I use the OpenseaAPI and a tiny bit of jQuery to fetch the metadata associated with each NFT, query the `external_url` and replace the html content on each chapter page with whatever comes back. It takes [14 lines of code](https://github.com/andytudhope/finding-the-blue-book/blob/gh-pages/assets/js/main.js) to do this.
5. Guardians are therefore entirely in control of what gets displayed for their chapter and can change it by using the `updateTokenURI` method in the [Guardians.sol contract](https://etherscan.io/address/0xeB3fC95B74C79C2c3469188A72df2c2399D752AB#writeContract).

## Fork This Repo

If you only want to run the site itself, it's very simple:

```
git clone https://github.com/andytudhope/finding-the-blue-book.git
cd finding-the-blue-book
git checkout gh-pages
http-server
```

If you want to know how to work with these contracts and do more fancy things yourself, please read the instructions in the beautiful [Dynamic Culture Neurapunks repo](https://github.com/Dynamiculture/neurapunks-contract) where I got them from.

## Change Your Page

This is intended for Guardians.

1. Make a new html document containing whatever you want to appear in your chapter. You can look at examples on the [gh-pages branch of this repo](https://github.com/andytudhope/finding-the-blue-book/tree/gh-pages).
2. You can include whatever you like in that html, so long as it is a single page. Literally, whatever scripts and stylesheets you please.
3. I use an old tool called [Arweave deploy](https://github.com/ArweaveTeam/arweave-deploy) to deploy this single page, using the `--package` option it came with to ensure my js and css gets bundled up with the html. You might choose to use something more current.
4. Once you have the arweave url for your chapter, check the [assets](https://github.com/andytudhope/finding-the-blue-book/tree/main/assets) dir in this branch to find the current json fole for your chapter. Change the `external_url` field, and then upload that json to arweave too.

Now, we need to tell the Guardians contract about your updated metadata, which means calling the unique `setMetadataUri()` function I wrote. This requires that we translate the arweave url for the json file you just uploaded into hexadecimal format. This is a bit finicky. For this reason, we have a `update-tokenuri.ts` file in the [tasks/operations/](https://github.com/andytudhope/finding-the-blue-book/blob/main/tasks/operations/update-tokenuri.ts) dir.  The idea is that you can use this file to find out what data you need to submit to the mainnet contract, but test things first on Goerli.

You will find a comment at the top of that file that shows the command required to update a tokenURI:

```
npx hardhat update-tokenuri --network goerli --token-id 1 --metadata-uri ar://WbxzF2cys_GLFpg9HMa8VdlArwJ-OjBA-T5YxY0C7c0
```

1. Swap our the arweave URL for the one you got back in step 3 above.
2. Run the command.
3. You should get a whole bunch of information logged to your console. Check through it for the `data` field, which should look something like this:

'0x18e97fd100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000003061723a2f2f5762787a46326379735f474c46706739484d613856646c4172774a2d4f6a42412d5435597859304337633000000000000000000000000000000000'

4. You will need to change that `1` in the middle to whatever `tokenId` you guard. These tokenIds start from 0, not 1, so Chapter 3's guardian has a tokenId of 2. However, I made a mistake around Chapter 8, so from 8 onwards, your chapter is your tokenId. Otherwise, this is the exact data you need to sign and submit on mainnet. 

To do this, open your wallet (MetaMask or similar). In MetaMask: 

1. Go to "Settings" by clicking the avatar image in the top right.
2. Click "Advanced"
3. Switch "Show Hex Data" to on.
4. Then, click "Send" in the main screen and use the Guardian contract address as the recipient: `0xeb3fc95b74c79c2c3469188a72df2c2399d752ab``
5. Don't send any ETH, and simply put the data you created above into the newly appeared "Hex Data:" field (remembering to switch out the lonely `1` for the `tokenId` you actually guard).
6. Sign the transaction and, once it has confirmed and the Alchemy API has had some time to update, you should see your new chapter appear in the right place of finding.thebluebook.co.za

If you're wondering about the `0x18e97fd1` at the beginning of the data: it's because we begin any transaction with `0x` by convention, and the declare the first four bytes of the keccak256 hash of the function name so the EVM knows what function we're calling on the address we have specified in the `to` field of our transaction. `18e97fd1` are those first four bytes of the keccak256 hash of `setMetadataUri()`.