pragma solidity ^0.4.18;

contract Pub {
    struct Publication {
        address source;
        string title;
        string body;
    }

    mapping (address => uint256[]) public allByAuthor;
    // anonymous by default
    mapping (address => string) public authors;
    Publication[] public all;

    function Pub() public { }

    function publish(string _title, string _body)
    external
    returns (uint) {
        uint index = all.length;
        all.push(Publication(
            msg.sender,
            _title,
            _body
        ));
        allByAuthor[msg.sender].push(index);
        return index;
    }

    function sign(string _name)
    external {
        authors[msg.sender] = _name;
    }

    function publicationCount(address _author)
    external view
    returns (uint) {
        return allByAuthor[_author].length;
    }

    function size()
    external view
    returns (uint) {
        return all.length;
    }
}
