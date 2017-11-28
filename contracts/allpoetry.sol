pragma solidity ^0.4.18;

/**
 * WIP for allpoetry.eth
 * Manually audited poetry collection contract
 * 
 *
 * State Diagram:
 * 
 * UNCONTACTED -> APPLIED <-> REJECTED
 *      |            |
 *      v            v
 *    BOARD       ACCEPTED
 */
contract AllPoetry {
    // the application fee serves to incentivize the board to review applications quickly
    uint256 constant public registrationBounty = 5 finney;
    // the board receives less when it rejects candidates
    uint256 constant public invalidationBounty = 1 finney;

    enum Membership {
        UNCONTACTED, // default
        BOARD, // allowed to approve poetry
        SOURCE // AllPoetry creator
    }

    enum Status {
        PENDING,
        REJECTED, // rejected applicant
        ACCEPTED // accepted applicant
    }

    mapping (address => Membership) public membership;
    struct Submission {
        Status status;
        uint256 allPubsIndex;
        uint256 internalPubId;
    }
    struct Poem {
        uint256 allPubsIndex;
        // even for pubs that aren't index-based, 32 bytes should be enough to encode the identity
        uint256 internalPubId;
    }
    mapping (address => Submission[]) public submissions;
    Poem[] public poetry;

    function AllPoetry()
    public {
        membership[msg.sender] = Membership.SOURCE;
    }

    event PoemRegistered(address submitter, uint256 allPubsIndex, uint256 submissionId);
    event PoemAccepted(address submitter, uint256 submissionId);
    event PoemRejected(address submitter, uint256 submissionId, string reason);

    function poetryCount()
    public view
    returns (uint256) {
        return poetry.length;
    }

    function register(uint256 _allPubsIndex, uint256 _poemIndex)
    external payable {
        assert(msg.value == registrationBounty);
        submissions[msg.sender].push(Submission(
            Status.PENDING,
            _allPubsIndex,
            _poemIndex
        ));
        PoemRegistered(msg.sender, _allPubsIndex, _poemIndex);
    }

    function accept(address _submitter, uint256 _submissionId)
    external {
        assert(membership[msg.sender] >= Membership.BOARD);
        Submission storage submission = submissions[_submitter][_submissionId];
        assert(submission.status == Status.PENDING);
        submission.status = Status.ACCEPTED;
        poetry.push(Poem(
            submission.allPubsIndex,
            submission.internalPubId
        ));
        msg.sender.transfer(registrationBounty);
        PoemAccepted(_submitter, _submissionId);
    }

    function reject(address _submitter, uint256 _submissionId, string _reason)
    external {
        assert(membership[msg.sender] >= Membership.BOARD);
        Submission storage submission = submissions[_submitter][_submissionId];
        assert(submission.status == Status.PENDING);
        submission.status = Status.REJECTED;
        msg.sender.transfer(invalidationBounty);
        PoemRejected(_submitter, _submissionId, _reason);
    }

    event NewBoardMember(address _boardMember);

    function appoint(address _delegate)
    external {
        assert(membership[msg.sender] >= Membership.BOARD);
        assert(membership[_delegate] == Membership.UNCONTACTED);
        membership[_delegate] = Membership.BOARD;
        NewBoardMember(_delegate);
    }
}

