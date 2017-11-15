# Pub
Pub is the archive of the Internet.
Ethereum powers Pub, and Pub powers Grafiti, a Dapp hosted at <http://grafiti.online>.

## Why Use Pub
Pub is the cheapest censorship-resistant publication platform available.
There are no profiteers, including yourself and the developers.
All published content is freely available to everyone for the duration of the Ethereum Network.
Pub is immutable.
Pub is forever.

## How to Publish via Pub
### Read the contract
Pub source code is available in [pub.sol](https://github.com/wjmelements/pub/blob/master/contracts/pub.sol) and also on [Etherscan](https://etherscan.io/address/0x2a0f713aA953442EacA9EA47083f656170e67BA4).
The code is easy to understand and only 63 lines.
You should never interact with a contract you do not understand.

### Get a Web 3.0 Capable Web Browser

#### Option: grafiti.online
[Grafiti](http://grafiti.online) is a website facilitating browsing and submission.
Metamask is an add-on for Chrome, Firefox, Opera, and Edge that allows them to interface with Ethereum.

#### Option: Using the Mist Contract
[Install Mist](https://github.com/ethereum/mist/releases) from Github.
Mist is an open-source Dapp browser specialized for Ethereum.
To sync faster, enable the "Sync with Light client" option.
### Locate Pub
In Mist, go to Contracts > Watch Contract.
Pub is currently located at `0x2a0f713aA953442EacA9EA47083f656170e67BA4`.
The ABI is:

```
[{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"allByAuthor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"all","outputs":[{"name":"source","type":"address"},{"name":"title","type":"string"},{"name":"body","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"sign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"size","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_author","type":"address"}],"name":"publicationCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"authors","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_title","type":"string"},{"name":"_body","type":"string"}],"name":"publish","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
```

Optionally, verify the published contract matches the bytes generated from `solc --bin pub.sol`.
The output bytes will never change because the compiler version is specified.
[Etherscan.io](http://etherscan.io/contract/0x2a0f713aA953442EacA9EA47083f656170e67BA4) does this automatically, but be cautious trusting third parties with this responsibility.

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

### Execute publish()
Be sure to provide enough gas.
Gas cost is calculable, but not yet automatically calculated.
The recommended gas is 166367 + 348 per byte.
Verify there is no cheaper format for your content.
Verify there are no errors in your content.
You will not be able to edit or update your publication.

### Optional: Execute sign()
If you do not wish to remain anonymous, you may sign your work.
Beware this will de-anonymize all your other activity with this key.

## Alternative: Using geth
If you have [geth](https://github.com/ethereum/go-ethereum) setup, do:

```javascript
var pub = eth.contract([{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"allByAuthor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"all","outputs":[{"name":"source","type":"address"},{"name":"timestamp","type":"uint256"},{"name":"title","type":"string"},{"name":"body","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"sign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_title","type":"string"},{"name":"_body","type":"bytes"}],"name":"publishBytes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"size","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_author","type":"address"}],"name":"publicationCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"authors","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_title","type":"string"},{"name":"_body","type":"string"}],"name":"publish","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]).at('0x2a0f713aA953442EacA9EA47083f656170e67BA4')

title="Your Title"

body="Your Content"

personal.unlockAccount(eth.accounts[0])

pub.publish.sendTransaction(title, body, {from:eth.accounts[0], gas:(166367+348*(title.length+body.length))})
```

## Publication Guidelines
You pay by the byte.
Use the cheapest format possible. Usually that will be .svg or .webp for images.
Be brief.

Have foresight.

[*DO NOT break the laws of your country*](LEGAL.md).

## Contributing
Please open pull requests on github.
### Pub
Optimizations that reduce the cost of publication are welcome.
Future publication contracts will be hosted on allpubs.eth.
allpubs.sol is not yet finalized.

Augmentations to the feature set, such as comments, tagging, and tipping, are best implemented as standalone contracts that reference the Pub.
New contracts can be integrated into any front end, including Grafiti.
