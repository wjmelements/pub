pragma solidity ^0.4.18;

interface PriorPub {
    function all(uint256 _index)
    public view
    returns (Pub.Publication);
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

    function Pub(PriorPub _priorPub) public {
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
        all.push(priorPub.all(lastPriorPubSyncIndex));
        lastPriorPubSyncIndex++;
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
