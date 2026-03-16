// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IEnergyToken.sol";

contract KuryenTradeSystemNFT is ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl {
    enum SystemState {
        ACTIVE,
        MAINTENANCE,
        DISCONNECTED
    }

    struct SystemData {
        uint256 capacityWatts;
        bytes32 locationHash;
        uint256 installationDate;
        bytes32 hardwareId;
        SystemState state;
        uint256 totalGenerated;
        uint256 lastClaimTime;
    }

    IEnergyToken public energyToken;
    uint256 private _nextTokenId;
    mapping(uint256 => SystemData) private _systems;

    event SystemMinted(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 capacityWatts,
        bytes32 hardwareId
    );

    event GenerationClaimed(
        uint256 indexed tokenId,
        address indexed claimant,
        uint256 kwhGenerated,
        uint256 ectMinted
    );

    event SystemStateChanged(
        uint256 indexed tokenId,
        SystemState oldState,
        SystemState newState
    );

    event EnergyTokenSet(address indexed energyToken);

    event AdminTransfer(uint256 indexed tokenId, address indexed from, address indexed to);

    error SystemNotActive(uint256 tokenId);
    error ZeroAddress();
    error ZeroCapacity();
    error EnergyTokenNotSet();
    error InvalidTokenId(uint256 tokenId);
    error TransferNotAllowed();
    error NotSystemOwner();

    constructor() ERC721("KuryenTrade System NFT", "KTSYS") {
        _nextTokenId = 1;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setEnergyToken(address _energyToken) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_energyToken == address(0)) revert ZeroAddress();
        energyToken = IEnergyToken(_energyToken);
        emit EnergyTokenSet(_energyToken);
    }

    // *
    function mintSystem(
        address to,
        uint256 capacityWatts,
        bytes32 locationHash,
        bytes32 hardwareId
    ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256 tokenId) {
        if (to == address(0)) revert ZeroAddress();
        if (capacityWatts == 0) revert ZeroCapacity();

        tokenId = _nextTokenId++;

        _systems[tokenId] = SystemData({
            capacityWatts: capacityWatts,
            locationHash: locationHash,
            installationDate: block.timestamp,
            hardwareId: hardwareId,
            state: SystemState.ACTIVE,
            totalGenerated: 0,
            lastClaimTime: 0
        });

        _safeMint(to, tokenId);

        emit SystemMinted(tokenId, to, capacityWatts, hardwareId);
    }

    function adminTransfer(
        address from,
        address to,
        uint256 tokenId
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (to == address(0)) revert ZeroAddress();
        if (!_exists(tokenId)) revert InvalidTokenId(tokenId);

        _transfer(from, to, tokenId);

        emit AdminTransfer(tokenId, from, to);
    }

    function setSystemState(uint256 tokenId, SystemState state) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!_exists(tokenId)) revert InvalidTokenId(tokenId);

        SystemData storage system = _systems[tokenId];
        SystemState oldState = system.state;
        system.state = state;

        emit SystemStateChanged(tokenId, oldState, state);
    }

    function setTokenURI(uint256 tokenId, string calldata uri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!_exists(tokenId)) revert InvalidTokenId(tokenId);
        _setTokenURI(tokenId, uri);
    }
    
    // *
    function claimGeneration(
        uint256 tokenId,
        uint256 kwhGenerated
    ) external {
        if (ownerOf(tokenId) != msg.sender) revert NotSystemOwner();
        if (!_exists(tokenId)) revert InvalidTokenId(tokenId);

        SystemData storage system = _systems[tokenId];
        if (system.state != SystemState.ACTIVE) revert SystemNotActive(tokenId);
        if (address(energyToken) == address(0)) revert EnergyTokenNotSet();

        system.totalGenerated += kwhGenerated;
        system.lastClaimTime = block.timestamp;

        uint256 tokenAmount = kwhGenerated * 1e18;
        energyToken.mint(msg.sender, tokenAmount);

        emit GenerationClaimed(tokenId, msg.sender, kwhGenerated, tokenAmount);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId > 0 && tokenId < _nextTokenId;
    }

    function getSystemData(uint256 tokenId) external view returns (SystemData memory) {
        if (!_exists(tokenId)) revert InvalidTokenId(tokenId);
        return _systems[tokenId];
    }

    function isSystemActive(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) revert InvalidTokenId(tokenId);
        return _systems[tokenId].state == SystemState.ACTIVE;
    }

    function totalSystems() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function getSystemsByOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokenIds;
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        address from = _ownerOf(tokenId);

        if (from == address(0)) {
            return super._update(to, tokenId, auth);
        }

        if (to == address(0)) {
            if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
                revert TransferNotAllowed();
            }
            return super._update(to, tokenId, auth);
        }

        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert TransferNotAllowed();
        }

        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
