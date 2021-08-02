$.get("https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&asset_contract_address=0xeB3fC95B74C79C2c3469188A72df2c2399D752AB",function(allIds){
    let chapter1 = allIds.assets[0].external_link;
    let chapter2 = allIds.assets[1].external_link;
    
    $.get(chapter1.toString(),function(chap1){
        console.log(chap1);
    });

    $.get(chapter2.toString(),function(chap2){
        console.log(chap2);
    });
});

