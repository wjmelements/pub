pragma solidity ^0.4.18;

contract Pub {
    struct Publication {
        address source;
        string title;
        string body;
    }

    mapping (address => uint64[]) public allByAuthor;
    // anonymous by default
    mapping (address => string) public authors;
    Publication[] public all;

    function Pub() public { }

    function publish(string _title, string _body) external 
        returns (uint64) {
        uint64 index = (uint64)(all.length);
        all.push(Publication(
            msg.sender,
            _title,
            _body
        ));
        allByAuthor[msg.sender].push(index);
        return index;
    }

    function sign(string name) external {
        authors[msg.sender] = name;
    }
}
