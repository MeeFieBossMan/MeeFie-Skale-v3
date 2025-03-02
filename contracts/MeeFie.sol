// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title MeeFieTestToken
 * @dev ERC-20 token with buy/sell taxation.
 */
contract MeeFieTestToken is ERC20, Ownable {
    using Address for address;

    uint256 public constant BUY_TAX_PERCENT = 2;  // 2% Buy Tax
    uint256 public constant SELL_TAX_PERCENT = 5; // 5% Sell Tax

    address public immutable treasuryWallet;
    address public sushiswapPair;

    mapping(address => bool) private _isExcludedFromTax;

    /**
     * @notice Initializes the token with a name, symbol, and initial supply.
     * @param initialSupply Initial token supply.
     * @param _treasuryWallet Treasury wallet for collecting tax.
     * @param initialOwner The owner of the contract.
     */
    constructor(uint256 initialSupply, address _treasuryWallet, address initialOwner)
        ERC20("MeeFieTestToken", "MFIE")
        Ownable(initialOwner)  // ✅ Pass initialOwner to Ownable
    {
        require(_treasuryWallet != address(0), "Invalid treasury address");

        treasuryWallet = _treasuryWallet;
        _mint(initialOwner, initialSupply * 10 ** decimals());

        // Exclude owner and treasury from taxes
        _isExcludedFromTax[initialOwner] = true;
        _isExcludedFromTax[_treasuryWallet] = true;
    }

    /**
     * @notice Sets the SushiSwap pair address for tax application.
     * @dev Should be called after adding liquidity.
     * @param _pair The SushiSwap pair address.
     */
    function setSushiswapPair(address _pair) external onlyOwner {
        require(_pair != address(0), "Invalid pair address");
        sushiswapPair = _pair;
    }

    /**
     * @notice Overrides OpenZeppelin’s `_update` to apply tax logic.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override {
        uint256 taxAmount = 0;

        if (!_isExcludedFromTax[from] && !_isExcludedFromTax[to]) {
            if (from == sushiswapPair) {
                // Buy tax (2%)
                taxAmount = (value * BUY_TAX_PERCENT) / 100;
            } else if (to == sushiswapPair) {
                // Sell tax (5%)
                taxAmount = (value * SELL_TAX_PERCENT) / 100;
            }
        }

        uint256 transferAmount = value - taxAmount;

        if (taxAmount > 0) {
            super._update(from, treasuryWallet, taxAmount);
        }

        super._update(from, to, transferAmount);
    }

    /**
     * @notice Excludes or includes an address from taxation.
     * @param account The address to modify.
     * @param excluded Whether the account should be excluded from tax.
     */
    function setTaxExemption(address account, bool excluded) external onlyOwner {
        _isExcludedFromTax[account] = excluded;
    }
}

