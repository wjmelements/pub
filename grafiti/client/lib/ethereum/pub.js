window.addEventListener('load', function() {
    if (typeof web3 === 'undefined') {
        //web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
        document.getElementById("withoutweb3").hidden = false;
        document.getElementById("withweb3").hidden=true;
        return;
    }
    fetchSize();
});

pub = web3.eth.contract([ { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "uint256" } ], "name": "allByAuthor", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "all", "outputs": [ { "name": "source", "type": "address", "value": "0x4a6f6b9ff1fc974096f9063a45fd12bd5b928ad1" }, { "name": "title", "type": "string", "value": "aware" }, { "name": "body", "type": "string", "value": "we are cognition\nwe are aware we are cognition\nwe prefer cognition to oblivion\nmost are oblivious\nwe are aware\nso we must save them\nas many as possible\n as soon as we can" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_name", "type": "string" } ], "name": "sign", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "size", "outputs": [ { "name": "", "type": "uint256", "value": "2" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_author", "type": "address" } ], "name": "publicationCount", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "authors", "outputs": [ { "name": "", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_title", "type": "string" }, { "name": "_body", "type": "string" } ], "name": "publish", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ]).at('0x80d9b122Dc3a16FdC41f96cF010FFE7e38d227C3')

var onSize = [];
var pub_size = -1;
// TODO intelligent caching
var pub_map = {};
function fetchSize() {
    console.log("Fetching Pub size");
    pub.size(function (error, result) {
        if (error) {
            console.log(error);
            return;
        }
        pub_size = result.c[0]
        while (onSize.length > 0) {
            onSize.pop()();
        }
    });
}

function fetchPub(index, resultFn) {
    pub.all(index, function (error, result) {
        if (error) {
            console.log(error);
            return;
        }
        pub_map[index] = result
        resultFn(index, result)
    });
}

Pub = {
    size: function() {
        return pub_size;
    },
    fetchSize: function() {
        fetchSize();
    },
    getRandom: function(resultFn) {
        index=Math.floor(Math.random() * Pub.size())
        return Pub.get(index, resultFn)
    },
    get: function(index, resultFn) {
        result=pub_map[index]
        if (result != undefined) {
            resultFn(index, result);
            return;
        }
        fetchPub(index, resultFn);
    },
    getLast: function(resultFn) {
        if (pub_size == -1) {
            onSize.push(function() {
                Pub.get(pub_size - 1, resultFn);
            });
            return;
        }
        return Pub.get(pub_size - 1, resultFn);
    },
}
