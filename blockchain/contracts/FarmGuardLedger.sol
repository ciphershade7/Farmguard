// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title FarmGuardLedger
/// @notice Tamper-evident audit/proof layer for FarmGuard.
///         Stores ONLY identifiers, timestamps and a cryptographic hash of each
///         off-chain record (treatments, withdrawal clearances, milk-batch events).
///         The full record data continues to live in FarmGuard's SQLite database;
///         this contract lets anyone recompute a record's hash and compare it
///         against what was committed here to prove the off-chain data has not
///         been altered since it was anchored.
contract FarmGuardLedger {
    struct Record {
        string recordType;   // e.g. "TREATMENT", "BATCH_CLEARANCE"
        string referenceId;  // FarmGuard-side identifier, e.g. "TREATMENT-42", "BCH-8801"
        string farmId;       // e.g. "FARM-A"
        bytes32 dataHash;    // keccak256 hash of the canonical off-chain record JSON
        uint256 timestamp;   // block timestamp when the record was anchored
        address submitter;   // wallet that submitted the record
    }

    Record[] private records;

    // referenceId => indices of all records anchored under that reference
    mapping(string => uint256[]) private referenceIndex;

    event RecordAdded(
        uint256 indexed recordIndex,
        string recordType,
        string referenceId,
        string farmId,
        bytes32 dataHash,
        uint256 timestamp,
        address submitter
    );

    /// @notice Anchor a new record on-chain. Called by the FarmGuard backend
    ///         whenever a treatment, withdrawal clearance, or batch event occurs.
    function addRecord(
        string calldata recordType,
        string calldata referenceId,
        string calldata farmId,
        bytes32 dataHash
    ) external returns (uint256 recordIndex) {
        records.push(Record({
            recordType: recordType,
            referenceId: referenceId,
            farmId: farmId,
            dataHash: dataHash,
            timestamp: block.timestamp,
            submitter: msg.sender
        }));

        recordIndex = records.length - 1;
        referenceIndex[referenceId].push(recordIndex);

        emit RecordAdded(recordIndex, recordType, referenceId, farmId, dataHash, block.timestamp, msg.sender);
    }

    /// @notice Total number of records ever anchored.
    function getRecordCount() external view returns (uint256) {
        return records.length;
    }

    /// @notice Fetch a single record by its index.
    function getRecord(uint256 index) external view returns (Record memory) {
        require(index < records.length, "FarmGuardLedger: index out of range");
        return records[index];
    }

    /// @notice All record indices anchored under a given FarmGuard referenceId
    ///         (e.g. all events for the same treatment or batch).
    function getIndicesForReference(string calldata referenceId) external view returns (uint256[] memory) {
        return referenceIndex[referenceId];
    }

    /// @notice Convenience check: does `hashToCheck` match the hash stored on-chain
    ///         for `index`? Used by FarmGuard's verification flow.
    function verifyHash(uint256 index, bytes32 hashToCheck) external view returns (bool) {
        require(index < records.length, "FarmGuardLedger: index out of range");
        return records[index].dataHash == hashToCheck;
    }
}
