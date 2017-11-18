pragma solidity ^0.4.18;

/**
 * Template for creating a blog to submit to AllPubs
 */
contract Blog {
    
    struct Publication {
        address source;
        uint256 timestamp;
        string title;
        // must be bytes in order to support files
        bytes body;
    }

    enum Membership {
        UNCONTACTED, // default
        AUTHOR, // can publish
        BOARD, // can appoint and ban authors
        SOURCE // Blog creator
    }

    modifier onlyAuthor {
        assert(membership[msg.sender] >= Membership.AUTHOR);
        _;
    }
    
    modifier onlyBoard {
        assert(membership[msg.sender] >= Membership.BOARD);
        _;
    }

    string public name;
    mapping (address => Membership) public membership;
    mapping (address => uint256[]) public allByAuthor;
    // anonymous by default
    mapping (address => string) public authors;
    Publication[] public all;

    function Blog(string _name) public {
        name = _name;
        membership[msg.sender] = Membership.SOURCE;
    }

    function makeAuthor(address _author)
    external onlyBoard {
        assert(membership[_author] < Membership.AUTHOR);
        membership[_author] = Membership.AUTHOR;
    }

    function banAuthor(address _author)
    external onlyBoard {
        assert(membership[_author] == Membership.AUTHOR);
        membership[_author] = Membership.UNCONTACTED;
    }

    function makeBoard(address _author)
    external onlyBoard {
        assert(membership[_author] < Membership.BOARD);
        membership[_author] = Membership.BOARD;
    }

    function publishBytes(string _title, bytes _body)
    external onlyAuthor 
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
    external onlyAuthor 
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
}
