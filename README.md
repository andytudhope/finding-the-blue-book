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
cd finding-the-blue-book/public
http-server
```

If you want to know how to work with these contracts and do more fancy things yourself, please read the instructions in the beautiful [Dynamic Culture Neurapunks repo](https://github.com/Dynamiculture/neurapunks-contract) where I got them from.