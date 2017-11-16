etherPriceUSD = 331;
function fetchETHPrice() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', false /*asynchronous*/);
    xmlHttp.onreadystatechange = function() {
        var response = JSON.parse(xmlHttp.responseText);
        etherPriceUSD = response.USD;
        console.log("Price is " + etherPriceUSD);
    }
    xmlHttp.send(null);
}
fetchETHPrice();
