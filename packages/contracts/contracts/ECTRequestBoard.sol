// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ECTRequestBoard is ReentrancyGuard {
    enum RequestStatus { OPEN, FULFILLED, CANCELLED }

    struct Request {
        uint256 id;
        address requester;
        uint256 amountECT;
        uint256 pricePerECT;
        uint256 createdAt;
        uint256 fulfilledAt;
        address fulfilledBy;
        RequestStatus status;
    }
    // immut!
    IERC20 public immutable ectToken;

    uint256 private _nextRequestId;
    mapping(uint256 => Request) private _requests;
    uint256[] private _allRequestIds;
    mapping(address => uint256[]) private _userRequests;
    uint256[] private _openRequestIds;
    mapping(uint256 => uint256) private _openRequestIndex;

    event RequestCreated(
        uint256 indexed requestId,
        address indexed requester,
        uint256 amountECT,
        uint256 pricePerECT
    );

    event RequestFulfilled(
        uint256 indexed requestId,
        address indexed requester,
        address indexed fulfiller,
        uint256 amountECT,
        uint256 totalPrice
    );

    event RequestCancelled(uint256 indexed requestId, address indexed requester);

    error InvalidAmount();
    error InvalidPrice();
    error RequestNotOpen();
    error NotRequester();
    error InsufficientPayment();
    error TransferFailed();

    constructor(address _ectToken) {
        ectToken = IERC20(_ectToken);
        _nextRequestId = 1;
    }

    function createRequest(uint256 amountECT, uint256 pricePerECT) external payable returns (uint256 requestId) {
        if (amountECT == 0) revert InvalidAmount();
        if (pricePerECT == 0) revert InvalidPrice();

        uint256 totalPrice = (amountECT * pricePerECT) / 1e18;
        if (msg.value < totalPrice) revert InsufficientPayment();

        requestId = _nextRequestId++;

        _requests[requestId] = Request({
            id: requestId,
            requester: msg.sender,
            amountECT: amountECT,
            pricePerECT: pricePerECT,
            createdAt: block.timestamp,
            fulfilledAt: 0,
            fulfilledBy: address(0),
            status: RequestStatus.OPEN
        });

        _allRequestIds.push(requestId);
        _userRequests[msg.sender].push(requestId);
        _openRequestIndex[requestId] = _openRequestIds.length;
        _openRequestIds.push(requestId);

        emit RequestCreated(requestId, msg.sender, amountECT, pricePerECT);

        if (msg.value > totalPrice) {
            (bool success, ) = msg.sender.call{value: msg.value - totalPrice}("");
            if (!success) revert TransferFailed();
        }
    }

    function fulfillRequest(uint256 requestId) external nonReentrant {
        Request storage request = _requests[requestId];
        if (request.status != RequestStatus.OPEN) revert RequestNotOpen();

        request.status = RequestStatus.FULFILLED;
        request.fulfilledAt = block.timestamp;
        request.fulfilledBy = msg.sender;

        _removeFromOpenRequests(requestId);

        uint256 totalPrice = (request.amountECT * request.pricePerECT) / 1e18;

        bool ectTransferred = ectToken.transferFrom(msg.sender, request.requester, request.amountECT);
        if (!ectTransferred) revert TransferFailed();

        (bool success, ) = msg.sender.call{value: totalPrice}("");
        if (!success) revert TransferFailed();

        emit RequestFulfilled(requestId, request.requester, msg.sender, request.amountECT, totalPrice);
    }

    function cancelRequest(uint256 requestId) external nonReentrant {
        Request storage request = _requests[requestId];
        if (request.requester != msg.sender) revert NotRequester();
        if (request.status != RequestStatus.OPEN) revert RequestNotOpen();

        request.status = RequestStatus.CANCELLED;
        _removeFromOpenRequests(requestId);

        uint256 totalPrice = (request.amountECT * request.pricePerECT) / 1e18;

        (bool success, ) = msg.sender.call{value: totalPrice}("");
        if (!success) revert TransferFailed();

        emit RequestCancelled(requestId, msg.sender);
    }

    function getRequest(uint256 requestId) external view returns (Request memory) {
        return _requests[requestId];
    }

    function totalRequests() external view returns (uint256) {
        return _nextRequestId - 1;
    }

    function openRequestCount() external view returns (uint256) {
        return _openRequestIds.length;
    }

    function getOpenRequests(uint256 offset, uint256 limit) external view returns (Request[] memory) {
        uint256 total = _openRequestIds.length;

        if (offset >= total) {
            return new Request[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        uint256 resultLength = end - offset;
        Request[] memory results = new Request[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            results[i] = _requests[_openRequestIds[offset + i]];
        }

        return results;
    }

    function getRequestsByUser(address user, uint256 offset, uint256 limit) external view returns (Request[] memory) {
        uint256[] storage userReqs = _userRequests[user];
        uint256 total = userReqs.length;

        if (offset >= total) {
            return new Request[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        uint256 resultLength = end - offset;
        Request[] memory results = new Request[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            results[i] = _requests[userReqs[offset + i]];
        }

        return results;
    }

    function getUserRequestCount(address user) external view returns (uint256) {
        return _userRequests[user].length;
    }

    function getAllRequestIds() external view returns (uint256[] memory) {
        return _allRequestIds;
    }

    function getOpenRequestIds() external view returns (uint256[] memory) {
        return _openRequestIds;
    }

    function calculateTotalPrice(uint256 amountECT, uint256 pricePerECT) external pure returns (uint256) {
        return (amountECT * pricePerECT) / 1e18;
    }

    function _removeFromOpenRequests(uint256 requestId) private {
        uint256 index = _openRequestIndex[requestId];
        uint256 lastIndex = _openRequestIds.length - 1;

        if (index != lastIndex) {
            uint256 lastRequestId = _openRequestIds[lastIndex];
            _openRequestIds[index] = lastRequestId;
            _openRequestIndex[lastRequestId] = index;
        }

        _openRequestIds.pop();
        delete _openRequestIndex[requestId];
    }
}
