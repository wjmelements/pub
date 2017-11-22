networkPrefix = function() {
    if (network.length > 1) {
        return network + '.';
    }
    return network;
}
network=''
nId = "1";
var refreshHandlers = [];
Net = {
    refreshNetwork: function() {
        web3.version.getNetwork((err, netId) => {
            switch (netId) {
                case "1":
                    network='';
                    break;
                case "3":
                    network='ropsten';
                    break;
                case "4":
                    network='rinkeby';
                    break;
            }
            if (nId != netId) {
                nId = netId;
                for (var i = 0; i < refreshHandlers.length; i++) {
                    refreshHandlers[i]();
                }
            }
        });
    },
    addRefreshHandler: function(refreshHandler) {
        refreshHandlers.push(refreshHandler);
    },
}
window.addEventListener('load', function() {
    if (typeof web3 === 'object')
    {
        if (typeof web3.version !== 'undefined') {
            nId = web3.version.network;
            Net.refreshNetwork();
        }
    }
});
