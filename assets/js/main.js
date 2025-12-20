$.get(
    "https://eth-mainnet.alchemyapi.io/v2/EPx6hNqYZwrb0hhmr9nsmavrbM8b6wch/getNFTsForCollection?contractAddress=0xeB3fC95B74C79C2c3469188A72df2c2399D752AB&startToken=0&withMetadata=true",
    function (result) {
        let nfts = result.nfts;

        nfts.sort((a, b) => a.id.tokenId - b.id.tokenId);

        window.loadChapter = function (chapterIndex, iframeId) {
            const nftIndex = chapterIndex <= 7 ? chapterIndex - 1 : chapterIndex;

            $.get(nfts[nftIndex].tokenUri.gateway, function (res) {
                const chapterxurl = res.external_url;
                $("#" + iframeId).attr("src", chapterxurl);
                console.log(
                    "the guardians have ensured you are seeing chapter " +
                        chapterIndex +
                        " content from " +
                        chapterxurl
                );
            });
        };
    }
);
