pragma solidity ^0.4.23;

interface PriorPub {
    function all(uint256 _index)
    external view
    returns (address source, uint256 timestamp, string title, bytes body);
}

contract Pub {
    struct Publication {
        address source;
        uint256 timestamp;
        string title;
        // must be bytes in order to support files
        bytes body;
    }

    mapping (address => uint256[]) public allByAuthor;
    // anonymous by default
    mapping (address => string) public authors;
    Publication[] public all;

    PriorPub priorPub;
    uint256 lastPriorPubSyncIndex;

    constructor(PriorPub _priorPub) public {
        priorPub = _priorPub;
    }

    function publishBytes(string _title, bytes _body)
    external
    returns (uint256) {
        uint256 index = all.length;
        all.push(Publication(
            msg.sender,
            now,
            _title,
            _body
        ));
        allByAuthor[msg.sender].push(index);
        return index;
    }

    function publish(string _title, string _body)
    external
    returns (uint256) {
        uint256 index = all.length;
        all.push(Publication(
            msg.sender,
            now,
            _title,
            bytes(_body)
        ));
        allByAuthor[msg.sender].push(index);
        return index;
    }

    function sign(string _name)
    external {
        authors[msg.sender] = _name;
    }

    function sync()
    external {
        address source;
        uint256 timestamp;
        string memory title;
        bytes memory body;
        (source, timestamp, title, body) = priorPub.all(lastPriorPubSyncIndex);
        all.push(Publication(source, timestamp, title, body));
        lastPriorPubSyncIndex++;
    }

    function syncPub(PriorPub priorSource, uint256 index)
    external {
        address source;
        uint256 timestamp;
        string memory title;
        bytes memory body;
        (source, timestamp, title, body) = priorSource.all(index);
        all.push(Publication(source, timestamp, title, body));
    }

    function publicationCount(address _author)
    external view
    returns (uint256) {
        return allByAuthor[_author].length;
    }

    function size()
    external view
    returns (uint256) {
        return all.length;
    }

    function title(uint256 _index)
    external view
    returns (string) {
        return all[_index].title;
    }

    function body(uint256 _index)
    external view
    returns (bytes) {
        return all[_index].body;
    }

    function source(uint256 _index)
    external view
    returns (address) {
        return all[_index].source;
    }

    function timestamp(uint256 _index)
    external view
    returns (uint256) {
        return all[_index].timestamp;
    }
}
