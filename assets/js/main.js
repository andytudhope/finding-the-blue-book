$.get("https://eth-mainnet.alchemyapi.io/v2/EPx6hNqYZwrb0hhmr9nsmavrbM8b6wch/getNFTsForCollection?contractAddress=0xeB3fC95B74C79C2c3469188A72df2c2399D752AB&startToken=0&withMetadata=true",function(result){
    
    let nfts = result.nfts;

    nfts.sort((a, b) => {
        return a.id.tokenId - b.id.tokenId;
    })

    $.get(nfts[0].tokenUri.gateway, function(res1) {
        chapter1url = res1.external_url;
        $.get(chapter1url.toString(),function(chap1){
            $("#one").html(chap1.toString());
            console.log("the guardians have ensured you are seeing chapter 1 content from " + chapter1url);
        });
    })

    $.get(nfts[1].tokenUri.gateway, function(res2) {
        chapter2url = res2.external_url;
        $.get(chapter2url.toString(),function(chap2){
            $("#two").html(chap2.toString());
            console.log("the guardians have ensured you are seeing chapter 2 content from " + chapter2url);
        });
    })

    $.get(nfts[2].tokenUri.gateway, function(res3) {
        chapter3url = res3.external_url;
        $.get(chapter3url.toString(),function(chap3){
            $("#three").html(chap3.toString());
            console.log("the guardians have ensured you are seeing chapter 3 content from " + chapter3url);
        });
    })

    $.get(nfts[3].tokenUri.gateway, function(res4) {
        chapter4url = res4.external_url;
        $.get(chapter4url.toString(),function(chap4){
            $("#four").html(chap4.toString());
            console.log("the guardians have ensured you are seeing chapter 4 content from " + chapter4url);
        });
    })

    $.get(nfts[4].tokenUri.gateway, function(res5) {
        chapter5url = res5.external_url;
        $.get(chapter5url.toString(),function(chap5){
            $("#five").html(chap5.toString());
            console.log("the guardians have ensured you are seeing chapter 5 content from " + chapter5url);
        });
    })

    $.get(nfts[5].tokenUri.gateway, function(res6) {
        chapter6url = res6.external_url;
        $.get(chapter6url.toString(),function(chap6){
            $("#six").html(chap6.toString());
            console.log("the guardians have ensured you are seeing chapter 6 content from " + chapter6url);
        });
    })

    $.get(nfts[6].tokenUri.gateway, function(res7) {
        chapter7url = res7.external_url;
        $.get(chapter7url.toString(),function(chap7){
            $("#seven").html(chap7.toString());
            console.log("the guardians have ensured you are seeing chapter 7 content from " + chapter7url);
        });
    })

    $.get(nfts[8].tokenUri.gateway, function(res8) {
        chapter8url = res8.external_url;
        $.get(chapter8url.toString(),function(chap8){
            $("#eight").html(chap8.toString());
            console.log("the guardians have ensured you are seeing chapter 8 content from " + chapter8url);
        });
    })

    $.get(nfts[9].tokenUri.gateway, function(res9) {
        chapter9url = res9.external_url;
        $.get(chapter9url.toString(),function(chap9){
            $("#nine").html(chap9.toString());
            console.log("the guardians have ensured you are seeing chapter 9 content from " + chapter9url);
        });
    })
});
