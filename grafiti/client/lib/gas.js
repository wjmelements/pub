Gas = {
    onTableChange: function () {
        console.log("onTableChange()");
        var table = document.getElementById('gas-estimate');
        var customGasPrice = (parseFloat(table.getElementsByClassName('gas-price')[0].value) || 0) * 0.000000001;
        for (var i = 1, row; row = table.rows[i]; i++) {
            var bytes, gas;
            for (var j = 0, cell; cell= row.cells[j]; j++) {
                switch (j) {
                    case 0:
                        var input = cell.getElementsByTagName('input')[0];
                        bytes = parseInt(input && input.value || cell.innerHTML) || 0;
                        break;
                    case 1:
                        cell.innerHTML = gas = bytes * 700 + 162556;
                        break;
                    case 2:
                    case 4:
                        var gasPrice = customGasPrice;
                        var etherCost = (gas * gasPrice).toFixed(9);
                        cell.innerHTML = "<p class='sans'>Ξ</p>" + etherCost;
                        row.cells[j+1].innerHTML = '$'+(etherCost * etherPriceUSD).toFixed(2);
                        break;
                }
            }
        }
    }
}
function setGasPrice(price) {
    console.log('Suggesting gas price: ' + price);
    document.getElementsByClassName('gas-price')[0].value = price;
    Gas.onTableChange();

}
function fetchGasPrice() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', 'https://ethgasstation.info/json/ethgasAPI.json', true /*asynchronous*/);
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.responseText) {
            var response = JSON.parse(xmlHttp.responseText);
            console.log(response);
            setGasPrice(response.safeLow / 10);
            xmlHttp.onreadystatechange = null;
        }
    };
    xmlHttp.send(null);
}
Template.gas.onRendered(function() {
    if (typeof web3 !== "undefined") {
        web3.eth.getGasPrice(function(error, result){
            if (error) {
                console.error(error);
                return;
            }
            setGasPrice(result.c[0] / 1e9);
        });
    }
    fetchGasPrice();
    Gas.onTableChange();
});
Template.gas.events({
  "change .custom-bytes,.gas-price"(event) {
    Gas.onTableChange();
  },
});
