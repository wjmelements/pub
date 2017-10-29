pragma solidity ^0.4.18;

contract Pub {
    struct Publication {
        address source;
        string title;
        string body;
    }

    mapping (bytes32 => uint256[]) public allByTag;
    mapping (address => uint256[]) public allByAuthor;
    // anonymous by default
    mapping (address => string) public authors;
    Publication[] public all;

    function Pub() public { }

    function publish(string _title, string _body)
    external
    returns (uint256) {
        uint256 index = all.length;
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

    function tag(uint256 _pubId, bytes32 _tag)
    external {
        assert(all[_pubId].source == msg.sender);
        allByTag[_tag].push(_pubId);
    }

    function publicationCount(address _author)
    external view
    returns (uint256) {
        return allByAuthor[_author].length;
    }

    function tagCount(bytes32 _tag)
    external view
    returns (uint256) {
        return allByTag[_tag].length;
    }

    function size()
    external view
    returns (uint256) {
        return all.length;
    }
}
