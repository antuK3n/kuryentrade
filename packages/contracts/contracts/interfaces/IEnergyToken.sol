// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IEnergyToken {
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
    function totalEnergyGenerated() external view returns (uint256);
    function totalEnergyConsumed() external view returns (uint256);
}
