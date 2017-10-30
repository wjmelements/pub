# Pub
Pub is a general-purpose publication contract for the Ethereum Network.

## Why Use Pub
Pub is the cheapest censorship-resistant publication platform available.
There are no profiteers, including yourself and the developers.
All published content is freely available to everyone for the duration of the Ethereum Network.
Pub is immutable.
Pub is forever.

## How to Use Pub
### Read the contract
Pub source code is available in [pub.sol](https://github.com/wjmelements/pub/blob/master/pub.sol) and also on [Etherscan](https://etherscan.io/address/0x80d9b122dc3a16fdc41f96cf010ffe7e38d227c3).
The code is easy to understand and only 46 lines.
You should never interact with a contract you do not understand.

### Use Mist
[Install Mist](https://github.com/ethereum/mist/releases) from Github.
Mist is an open-source Dapp browser specialized for Ethereum.
To sync faster, enable the "Sync with Light client" option.

### Obtain a key
Generate a key for the Ethereum Network.
In Pub as in Ethereum, your private key is your identity.
Please follow all of the best practices to protect your private key.
Your publications will be indexed with your public key.
If you intend to remain anonymous, you may consider generating a new key for every publication.

### Obtain ether
Ether is required to pay the cost of every node in the Ethereum Network permanently hosting your content.
The easiest and most common way to obtain ether is through a currency exchange.
The more bytes in your publication, the more ether you will need.

### Locate Pub
In Mist, go to Contracts > Watch Contract.
Pub is currently located at `0x80d9b122Dc3a16FdC41f96cF010FFE7e38d227C3`.
The ABI is:

```
[{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"allByAuthor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"all","outputs":[{"name":"source","type":"address"},{"name":"title","type":"string"},{"name":"body","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"sign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"size","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_author","type":"address"}],"name":"publicationCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"authors","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_title","type":"string"},{"name":"_body","type":"string"}],"name":"publish","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
```

Optionally, verify the published contract matches the bytes generated from `solc --bin pub.sol`.
The output bytes will never change because the compiler version is specified.

### Execute publish()
Be sure to provide enough gas.
Gas cost is calculable, but not yet automatically calculated.
The recommended gas is 180,000 + 680 per byte.
Verify there is no cheaper format for your content.
Verify there are no errors in your content.
You will not be able to edit or update your publication.

### Execute sign()
If you do not wish to remain anonymous, you may sign your work.
Beware this will de-anonymize all your other activity with this key.

## Alternative: Using geth
If you have [geth](https://github.com/ethereum/go-ethereum) setup, do:

```javascript
var pub = eth.contract([{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"allByAuthor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"all","outputs":[{"name":"source","type":"address"},{"name":"title","type":"string"},{"name":"body","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"sign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"size","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_author","type":"address"}],"name":"publicationCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"authors","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_title","type":"string"},{"name":"_body","type":"string"}],"name":"publish","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]).at('0x80d9b122Dc3a16FdC41f96cF010FFE7e38d227C3')

title="Your Title"

body="Your Content"

personal.unlockAccount(eth.accounts[0])

pub.publish.sendTransaction(title, body, {from:eth.accounts[0], gas:(180000+680*(title.length+body.length))})
```

## Contributing
Optimizations that reduce the cost of publication are welcome. Please create a pull request on Github.

Augmentations to the feature set, such as comments, tagging, and tipping, are best implemented as standalone contracts that reference the Pub.
