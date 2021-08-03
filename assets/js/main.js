$.get("https://api.opensea.io/api/v1/assets?order_direction=asc&offset=0&asset_contract_address=0xeB3fC95B74C79C2c3469188A72df2c2399D752AB",function(allIds){
    window.chapter1url = allIds.assets[0].external_link;
    window.chapter2url = allIds.assets[1].external_link;
    window.chapter3url = allIds.assets[2].external_link;
    
    $.get(window.chapter1url.toString(),function(chap1){
        $("#one").html(chap1.toString());
        console.log("the guardians have ensured you are seeing chapter 1 content from " + window.chapter1url);
    });

    $.get(window.chapter2url.toString(),function(chap2){
        $("#two").html(chap2.toString());
        console.log("the guardians have ensured you are seeing chapter 2 content from " + window.chapter2url);
    });

    $.get(window.chapter3url.toString(),function(chap3){
        $("#two").html(chap3.toString());
        console.log("the guardians have ensured you are seeing chapter 3 content from " + window.chapter3url);
    });
});
