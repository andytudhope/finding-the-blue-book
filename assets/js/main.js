$.get("https://api.opensea.io/api/v1/assets?order_direction=asc&offset=0&asset_contract_address=0xeB3fC95B74C79C2c3469188A72df2c2399D752AB",function(allIds){
    window.chapter1url = allIds.assets[0].external_link;
    window.chapter2url = allIds.assets[1].external_link;
    window.chapter3url = allIds.assets[2].external_link;
    window.chapter4url = allIds.assets[3].external_link;
    window.chapter5url = allIds.assets[4].external_link;
    window.chapter6url = allIds.assets[5].external_link;
    window.chapter7url = allIds.assets[6].external_link;
    window.chapter8url = allIds.assets[8].external_link;
    
    $.get(window.chapter1url.toString(),function(chap1){
        $("#one").html(chap1.toString());
        console.log("the guardians have ensured you are seeing chapter 1 content from " + window.chapter1url);
    });

    $.get(window.chapter2url.toString(),function(chap2){
        $("#two").html(chap2.toString());
        console.log("the guardians have ensured you are seeing chapter 2 content from " + window.chapter2url);
    });

    $.get(window.chapter3url.toString(),function(chap3){
        $("#three").html(chap3.toString());
        console.log("the guardians have ensured you are seeing chapter 3 content from " + window.chapter3url);
    });

    $.get(window.chapter4url.toString(),function(chap4){
        $("#four").html(chap4.toString());
        console.log("the guardians have ensured you are seeing chapter 4 content from " + window.chapter4url);
    });

    $.get(window.chapter5url.toString(),function(chap5){
        $("#five").html(chap5.toString());
        console.log("the guardians have ensured you are seeing chapter 5 content from " + window.chapter5url);
    });

    $.get(window.chapter6url.toString(),function(chap6){
        $("#six").html(chap6.toString());
        console.log("the guardians have ensured you are seeing chapter 6 content from " + window.chapter6url);
    });

    $.get(window.chapter7url.toString(),function(chap7){
        $("#seven").html(chap7.toString());
        console.log("the guardians have ensured you are seeing chapter 7 content from " + window.chapter7url);
    });

    $.get(window.chapter8url.toString(),function(chap8){
        $("#eight").html(chap8.toString());
        console.log("the guardians have ensured you are seeing chapter 8 content from " + window.chapter8url);
    });
});
