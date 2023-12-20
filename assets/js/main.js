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

    $.get(nfts[10].tokenUri.gateway, function(res10) {
        chapter10url = res10.external_url;
        $.get(chapter10url.toString(),function(chap10){
            $("#ten").html(chap10.toString());
            console.log("the guardians have ensured you are seeing chapter 10 content from " + chapter10url);
        });
    })

    $.get(nfts[11].tokenUri.gateway, function(res11) {
        chapter11url = res11.external_url;
        $.get(chapter11url.toString(),function(chap11){
            $("#eleven").html(chap11.toString());
            console.log("the guardians have ensured you are seeing chapter 11 content from " + chapter11url);
        });
    })

    $.get(nfts[12].tokenUri.gateway, function(res12) {
        chapter12url = res12.external_url;
        $.get(chapter12url.toString(),function(chap12){
            $("#twelve").html(chap12.toString());
            console.log("the guardians have ensured you are seeing chapter 12 content from " + chapter12url);
        });
    })

    $.get(nfts[13].tokenUri.gateway, function(res13) {
        chapter13url = res13.external_url;
        $.get(chapter13url.toString(),function(chap13){
            $("#thirteen").html(chap13.toString());
            console.log("the guardians have ensured you are seeing chapter 13 content from " + chapter13url);
        });
    })

    $.get(nfts[14].tokenUri.gateway, function(res14) {
        chapter14url = res14.external_url;
        $.get(chapter14url.toString(),function(chap14){
            $("#fourteen").html(chap14.toString());
            console.log("the guardians have ensured you are seeing chapter 14 content from " + chapter14url);
        });
    })

    $.get(nfts[15].tokenUri.gateway, function(res15) {
        chapter15url = res15.external_url;
        $.get(chapter15url.toString(),function(chap15){
            $("#fifteen").html(chap15.toString());
            console.log("the guardians have ensured you are seeing chapter 15 content from " + chapter15url);
        });
    })

    $.get(nfts[16].tokenUri.gateway, function(res16) {
        chapter16url = res16.external_url;
        $.get(chapter16url.toString(),function(chap16){
            $("#sixteen").html(chap16.toString());
            console.log("the guardians have ensured you are seeing chapter 16 content from " + chapter16url);
        });
    })

    $.get(nfts[17].tokenUri.gateway, function(res17) {
        chapter17url = res17.external_url;
        $.get(chapter17url.toString(),function(chap17){
            $("#seventeen").html(chap17.toString());
            console.log("the guardians have ensured you are seeing chapter 17 content from " + chapter17url);
        });
    })
});
