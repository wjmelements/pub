pragma solidity ^0.4.18;
interface ERC20 {
    function totalSupply() public constant returns (uint supply);
    function balanceOf(address _owner) public constant returns (uint balance);
    function transfer(address _to, uint _value) public returns (bool success);
    function transferFrom(address _from, address _to, uint _value) public returns (bool success);
    function approve(address _spender, uint _value) public returns (bool success);
    function allowance(address _owner, address _spender) public constant returns (uint remaining);
    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}
contract AllSpam {
    ERC20 public dai;

    mapping (uint256 => mapping (uint256 => bool)) public isSpam;

    struct PaymentMethod {
        ERC20 token;
        uint256 amount;
    }
    PaymentMethod[] methods;

    enum Membership {
        UNCONTACTED,
        BOARD
    }
    mapping (address => Membership) membership;

    function AllSpam() public {
        methods.push(PaymentMethod(
            ERC20(0x0), 500 szabo
        ));
    }

    modifier paysFee(uint256 _method) {
        PaymentMethod memory method = methods[_method];
        if (method.token != address(0)) {
            require(method.token.transferFrom(msg.sender, this, method.amount));
        } else {
            require(msg.value == method.amount);
        }
        _;
    }

    modifier mustBe(Membership _level) {
        require (membership[msg.sender] >= _level);
        _;
    }

    function markSpam(uint256 _allPubsIndex, uint256 _pubIndex, bool _isSpam, uint256 _method)
    external payable
    paysFee(_method) {
        isSpam[_allPubsIndex][_pubIndex] = _isSpam;
    }

    function addMethod(ERC20 _token, uint256 _amount)
    external
    mustBe(Membership.BOARD) {
        methods.push(PaymentMethod(_token, _amount));
    }

    function setCost(uint256 _method, uint256 _amount)
    external
    mustBe(Membership.BOARD) {
        methods[_method].amount = _amount;
    }

    function appoint(address _board)
    external
    mustBe(Membership.BOARD) {
        membership[_board] = Membership.BOARD;
    }

    function withdraw(uint256 _method)
    external
    mustBe(Membership.BOARD) {
        PaymentMethod memory method = methods[_method];
        if (method.token == address(0)) {
            msg.sender.transfer(this.balance);
        } else {
            method.token.transfer(msg.sender, method.token.balanceOf(this));
        }
    }
}
