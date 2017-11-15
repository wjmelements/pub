window.addEventListener('load', function() {
    if (typeof web3 === 'undefined') {
        //web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
        console.log("Using infura");
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/x6jRpmEj17uLQR1TuV1E"));
        Net.refreshNetwork();
    } else if (typeof web3.eth === 'undefined') {
        web3 = new Web3(web3.currentProvider);
    }
    var pubABI=[{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"allByAuthor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"all","outputs":[{"name":"source","type":"address"},{"name":"timestamp","type":"uint256"},{"name":"title","type":"string"},{"name":"body","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"sign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_title","type":"string"},{"name":"_body","type":"bytes"}],"name":"publishBytes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"size","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_author","type":"address"}],"name":"publicationCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"authors","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_title","type":"string"},{"name":"_body","type":"string"}],"name":"publish","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
    function refreshPub() {
        pub = web3.eth.contract(pubABI).at(Pub.getAddress())
        while (onPub.length) {
            onPub.pop()();
        }
    }
    Net.addRefreshHandler(refreshPub);
    refreshPub();
    fetchSize();
});

pub=null;
var onSize = [];
var onPub = [];
var pub_size = -1;
// TODO intelligent caching
var pub_map = {};
var author_map = {};
var pubcount_map = {};
var author_imap = {};
function fetchSize() {
    console.log("Fetching Pub size");
    pub.size(function (error, result) {
        if (error) {
            console.error(error);
            return;
        }
        pub_size = result.c[0]
        while (onSize.length > 0) {
            onSize.pop()();
        }
    });
}

function fetchPub(index, resultFn) {
    console.log("Fetching " + index);
    pub.all(index, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }
        pub_map[index] = result
        resultFn(index, result)
    });
}

function fetchAuthor(address, resultFn) {
    pub.authors(address, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }
        author_map[address] = result;
        resultFn(address, result);
    });
}

function fetchPublicationCount(address, resultFn) {
    pub.publicationCount(address, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }
        var emptyArray = [];
        result = result.c[0];
        emptyArray.length = result;
        author_imap[address] = emptyArray;
        pubcount_map[address] = result;
        resultFn(address, result);
    });
}

function fetchPublicationIndex(address, index, resultFn) {
    console.log("Fetching "+address+"["+index+"]");
    pub.allByAuthor(address, index, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }
        result = result.c[0];
        author_imap[address][index] = result;
        resultFn(address, result);
    });
}

function executePublish(title, content, resultFn) {
    pub.publish(title, content, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }
        resultFn(result);
    });
}

function executePublishBytes(title, content, resultFn) {
    pub.publishBytes(title, content, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }
        resultFn(result);
    });
}

Pub = {
    getAddress: function() {
        switch (nId) {
            default:
                console.error("No known Pub on this network:" + nId);
            case "1":
                return '0x2a0f713aA953442EacA9EA47083f656170e67BA4';
            case "4":
                console.log("Using Rinkeby");
                return '0xC68794C3C55e62b4D65291B6E061Ccf5ee678CF5';
        }
    },
    size: function() {
        return pub_size;
    },
    fetchSize: function() {
        fetchSize();
    },
    getRandomIndex: function(resultFn) {
        if (pub_size == -1) {
            onSize.push(function() {
                Pub.getRandomIndex(resultFn);
            });
        }
        index=Math.floor(Math.random() * pub_size);
        resultFn(index);
    },
    get: function(index, resultFn) {
        if (pub == null) {
            onPub.push(function() {
                Pub.get(index, resultFn);
            });
            return;
        }
        if (pub_size == -1) {
            onSize.push(function() {
                Pub.get(index, resultFn);
            });
            return;
        }
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
    getAuthorName: function(address, resultFn) {
        result = author_map[address];
        if (result != undefined) {
            resultFn(address, result);
            return;
        }
        fetchAuthor(address, resultFn);
    },
    getAuthorPublicationCount: function(address, resultFn) {
        result = pubcount_map[address];
        if (result != undefined) {
            resultFn(address, result);
            return;
        }
        fetchPublicationCount(address, resultFn);
    },
    getAuthorPublicationIndex: function (address, index, resultFn) {
        resultArray = author_imap[address];
        if (resultArray == undefined) {
            Pub.getAuthorPublicationCount(address, function(address, count) {
                Pub.getAuthorPublicationIndex(address, index, resultFn);
            });
            return;
        }
        if (resultArray[index] != undefined) {
            resultFn(address, resultArray[index]);
            return;
        }
        fetchPublicationIndex(address, index, resultFn);
    },
    getLastBy: function (address, resultFn) {
        console.log("getLastBy");
        Pub.getAuthorPublicationCount(address, function (address, count) {
            if (count == 0) {
                // TODO no publications for address
                console.error("No publications for " + address);
                return;
            }
            Pub.getAuthorPublicationIndex(address, count - 1, function(address, index) {
                Pub.get(index, resultFn);
            });
        });
    },
    publish: executePublish,
    publishBytes: executePublishBytes,
}
