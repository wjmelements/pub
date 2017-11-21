About = {
    onEnter: function (context) {
        console.log("About.onEnter");
        BlazeLayout.render('main', { main: "about" });
    },
    onExit: function(context) {
        console.log("About.onExit");
    },
};
function onTableChange() {
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
                    var gasPrice = j == 2 ? 0.000000002 : customGasPrice;
                    var etherCost = (gas * gasPrice).toFixed(9);
                    cell.innerHTML = etherCost;
                    row.cells[j+1].innerHTML = '$'+(etherCost * etherPriceUSD).toFixed(2);
                    break;
            }
        }
    }
}
Template.about.onRendered(function() {
    onTableChange();
});
Template.about.events({
  "change .custom-bytes,.gas-price"(event) {
    onTableChange();
  },
});
