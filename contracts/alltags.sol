pragma solidity ^0.4.18;
/**
 * WIP for alltags.eth
 */
contract AllTags {

    uint256 constant public submissionBounty = 10 finney;
    uint256 constant public rejectionBounty = 2 finney;
    uint256 constant public approvalBounty = 10 finney;

    struct Entry {
        // container pub index into AllPubs
        uint256 allPubsIndex;
        // even for pubs that aren't index-based, 32 bytes should be enough to encode the identity
        uint256 internalPubId;
    }
    // indexed by keccak256 since string indexes are currently unimplemented
    mapping (bytes32 => Entry[]) public tags;

    enum Membership {
        UNCONTACTED, // default
        MODERATOR, // allowed to approve tags
        BOARD // allowed to appoint and ban
    }
    mapping (address => Membership) public membership;

    function AllTags() public {
        membership[msg.sender] = Membership.BOARD;
    }

    function appoint(address _account, Membership _membership) external {
        assert(membership[msg.sender] >= Membership.BOARD);
        assert(membership[_account] < _membership);
        assert(_membership <= Membership.BOARD);
        membership[_account] = _membership;
    }

    event NewBan(address account, string reason);
    function ban(address _account, string _reason) external {
        assert(membership[msg.sender] >= Membership.BOARD);
        membership[_account] = Membership.UNCONTACTED;
        NewBan(_account, _reason);
    }

    enum Status {
        PENDING,
        REJECTED,
        APPROVED
    }
    struct Submission {
        Status status;
        uint256 allPubsIndex;
        uint256 internalPubId;
        string tag;
    }
    event TagPending(address source, uint256 index);
    event TagRejected(address source, uint256 index, string reason);
    event TagApproved(address source, uint256 index);
    mapping (address => Submission[]) public submissions;

    function submit(
        string _tag,
        uint256 _allPubsIndex,
        uint256 _internalPubId
    ) external payable {
        assert(msg.value == submissionBounty);
        uint256 index = submissions[msg.sender].length;
        submissions[msg.sender].push(Submission(
            Status.PENDING,
            _allPubsIndex,
            _internalPubId,
            _tag
        ));
        TagPending(msg.sender, index);
    }

    function reject(
        address _source,
        uint256 _submissionId,
        string _reason
    ) external {
        assert(membership[msg.sender] >= Membership.BOARD);
        assert(submissions[_source][_submissionId].status == Status.PENDING);
        submissions[_source][_submissionId].status = Status.REJECTED;
        TagRejected(_source, _submissionId, _reason);
        msg.sender.transfer(rejectionBounty);
    }

    function approve(
        address _source,
        uint256 _submissionId
    ) external {
        assert(membership[msg.sender] >= Membership.BOARD);
        assert(submissions[_source][_submissionId].status == Status.PENDING);
        submissions[_source][_submissionId].status = Status.APPROVED;
        TagApproved(_source, _submissionId);
        Submission storage submission = submissions[_source][_submissionId];
        tags[keccak256(submission.tag)].push(Entry(
            submission.allPubsIndex,
            submission.internalPubId
        ));
        msg.sender.transfer(approvalBounty);
    }

}
