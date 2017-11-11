network=''
networkPrefix = function() {
    if (network.length > 1) {
        return network + '.';
    }
    return network;
}
function refreshNetwork() {
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
    });
}
if (typeof web3 === 'object')
{
    refreshNetwork();
}
