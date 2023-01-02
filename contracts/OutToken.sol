// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract OutToken is ERC20,Ownable {
    uint256 private accounts ;
    address private immutable i_owner;

    constructor(uint256 initialSupply) ERC20("OutToken","OT") {
        _mint(msg.sender, initialSupply);
        i_owner = msg.sender;
      
    }
    function mint(uint256 _amount) public {
        require(_amount>0,"amount<0");
        _mint(msg.sender, _amount);
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }
    function getSpender()external view returns(address){
        return _msgSender();
    }

    function transferFrom(
        address from,   
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }
      
    function Buy(address _to) external payable{
        require(msg.value>0,"amount<0");

        address owner = _msgSender();
        accounts+=msg.value;
        console.log(msg.value);
        _transfer(owner, _to, msg.value);
    }
    function withdraw() public onlyOwner {
        require(accounts>0,"valid number");
        accounts=0;
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }
}
