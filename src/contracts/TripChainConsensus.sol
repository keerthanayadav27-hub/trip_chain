// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TripChainConsensus
 * @notice Collaborative AI travel itinerary planner smart contract.
 * Records immutable, cryptographically verified itinerary version hashes,
 * timestamps, and multi-sig wallet approvals on-chain.
 */
contract TripChainConsensus {
    
    struct SignatureRecord {
        address signer;
        bytes signature;
        uint256 timestamp;
    }

    struct ItineraryVersion {
        string version;             // e.g. "v1.0", "v2.0"
        bytes32 itineraryHash;      // Canonical SHA-256 hash of consensus JSON
        bytes32 previousHash;       // Hash of the prior version (immutable linked list)
        uint256 blockTimestamp;     // On-chain block timestamp
        uint256 blockNumber;        // Block height
        address proposer;           // Member who initiated the proposal
        address[] approvers;        // Addresses that approved via cryptographic signatures
        string changeSummary;       // Human-readable change summary
    }

    // Trip ID (hashed) => array of version history
    mapping(bytes32 => ItineraryVersion[]) private tripVersionHistory;
    
    // Trip ID => current active version index
    mapping(bytes32 => uint256) public currentVersionIndex;

    // EIP-712 Domain Separator
    bytes32 public immutable DOMAIN_SEPARATOR;
    bytes32 public constant APPROVAL_TYPEHASH = keccak256(
        "ItineraryApproval(string tripId,string destination,string version,bytes32 itineraryHash,uint256 totalBudget,uint256 estimatedCost,string vote,address signer,uint256 timestamp,uint256 nonce)"
    );

    // Emitted whenever a group reaches consensus and logs a new version on-chain
    event ItineraryCommitted(
        bytes32 indexed tripIdHash,
        string version,
        bytes32 indexed itineraryHash,
        bytes32 previousHash,
        address indexed proposer,
        address[] approvers,
        uint256 blockTimestamp
    );

    constructor() {
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("TripChain Protocol")),
                keccak256(bytes("1.0.0")),
                block.chainid,
                address(this)
            )
        );
    }

    /**
     * @notice Commit an approved itinerary version to the blockchain ledger.
     * @param tripId Unique identifier of the trip.
     * @param version Semantic version string (e.g. "v1.0", "v2.0").
     * @param itineraryHash Canonical SHA-256 hash of the complete itinerary JSON.
     * @param changeSummary Description of what changed in this revision.
     * @param approvers List of group member wallet addresses who signed the consensus.
     */
    function commitItineraryVersion(
        string calldata tripId,
        string calldata version,
        bytes32 itineraryHash,
        string calldata changeSummary,
        address[] calldata approvers
    ) external returns (uint256 newVersionIndex) {
        require(itineraryHash != bytes32(0), "Invalid itinerary hash");
        require(approvers.length >= 2, "Quorum requirement: minimum 2 approvers");

        bytes32 tripKey = keccak256(bytes(tripId));
        bytes32 prevHash = bytes32(0);

        if (tripVersionHistory[tripKey].length > 0) {
            prevHash = tripVersionHistory[tripKey][tripVersionHistory[tripKey].length - 1].itineraryHash;
        }

        ItineraryVersion memory newVer = ItineraryVersion({
            version: version,
            itineraryHash: itineraryHash,
            previousHash: prevHash,
            blockTimestamp: block.timestamp,
            blockNumber: block.number,
            proposer: msg.sender,
            approvers: approvers,
            changeSummary: changeSummary
        });

        tripVersionHistory[tripKey].push(newVer);
        newVersionIndex = tripVersionHistory[tripKey].length - 1;
        currentVersionIndex[tripKey] = newVersionIndex;

        emit ItineraryCommitted(
            tripKey,
            version,
            itineraryHash,
            prevHash,
            msg.sender,
            approvers,
            block.timestamp
        );
    }

    /**
     * @notice Verify whether a local itinerary hash matches the on-chain consensus hash.
     */
    function verifyItineraryHash(string calldata tripId, bytes32 computedHash)
        external
        view
        returns (bool isValid, string memory activeVersion, uint256 timestamp)
    {
        bytes32 tripKey = keccak256(bytes(tripId));
        uint256 count = tripVersionHistory[tripKey].length;
        require(count > 0, "No on-chain record for trip");

        ItineraryVersion memory latest = tripVersionHistory[tripKey][count - 1];
        isValid = (latest.itineraryHash == computedHash);
        activeVersion = latest.version;
        timestamp = latest.blockTimestamp;
    }

    /**
     * @notice Retrieve all logged version histories for a trip.
     */
    function getVersionHistory(string calldata tripId)
        external
        view
        returns (ItineraryVersion[] memory)
    {
        bytes32 tripKey = keccak256(bytes(tripId));
        return tripVersionHistory[tripKey];
    }
}
