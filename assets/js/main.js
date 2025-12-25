$.get(
    "https://eth-mainnet.g.alchemy.com/v2/EPx6hNqYZwrb0hhmr9nsmavrbM8b6wch/getNFTsForCollection?contractAddress=0xeB3fC95B74C79C2c3469188A72df2c2399D752AB&startToken=0&withMetadata=true",
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

        // Automatically detect and load the chapter iframe
        const chapterNameToNumber = {
            "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6,
            "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11,
            "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15,
            "sixteen": 16, "seventeen": 17, "eighteen": 18
        };

        // Find the iframe with a chapter ID
        const iframe = $("iframe[id]").first();
        if (iframe.length > 0) {
            const iframeId = iframe.attr("id");
            const chapterNumber = chapterNameToNumber[iframeId];
            
            if (chapterNumber) {
                window.loadChapter(chapterNumber, iframeId);
            } else {
                console.warn("Could not find chapter number for iframe ID:", iframeId);
            }
        }
    }
);
