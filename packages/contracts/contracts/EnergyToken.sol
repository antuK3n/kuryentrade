// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "./interfaces/IEnergyToken.sol";

contract EnergyToken is ERC20, ERC20Burnable, Ownable2Step, IEnergyToken {
    address public minter;
    uint256 public totalEnergyGenerated;
    uint256 public totalEnergyConsumed;

    event MinterUpdated(address indexed oldMinter, address indexed newMinter);
    event EnergyGenerated(address indexed to, uint256 amount);
    event EnergyConsumed(address indexed from, uint256 amount);

    error OnlyMinter();
    error ZeroAddress();

    modifier onlyMinter() {
        if (msg.sender != minter) revert OnlyMinter();
        _;
    }

    constructor() ERC20("Energy Credit Token", "ECT") Ownable(msg.sender) {}

    function setMinter(address _minter) external onlyOwner {
        if (_minter == address(0)) revert ZeroAddress();
        address oldMinter = minter;
        minter = _minter;
        emit MinterUpdated(oldMinter, _minter);
    }

    function mint(address to, uint256 amount) external onlyMinter {
        totalEnergyGenerated += amount;
        _mint(to, amount);
        emit EnergyGenerated(to, amount);
    }

    function burn(uint256 amount) public override(ERC20Burnable, IEnergyToken) {
        totalEnergyConsumed += amount;
        super.burn(amount);
        emit EnergyConsumed(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public override {
        totalEnergyConsumed += amount;
        super.burnFrom(account, amount);
        emit EnergyConsumed(account, amount);
    }
}
