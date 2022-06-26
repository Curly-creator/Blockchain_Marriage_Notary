// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract MarriageNotary {
    address notary;

    //Event that fires when a marriage receives money
    event LogRingBell(address addr, uint256 amount, uint256 contractBalance);

    constructor() public {
        notary = msg.sender;
    }

    struct Marriage {
        string leftName;
        string rightName;
        string vows;
        uint256 date;
        uint256 balance;
    }

    mapping(address => Marriage) public marriages;
    address[] public marriageList;

    // Only Contract-Deployer can use these functions
    modifier onlyNotary() {
        require(msg.sender == notary, "Only marriage notary can add marriages");
        _;
    }

    // Only Marriage-Couple can use these functions
    modifier onlyCouple(address _address) {
        require(
            msg.sender == _address,
            "Only couples with this wallet address can withdraw"
        );
        _;
    }

    function addMarriage(
        address _address,
        string memory _leftName,
        string memory _rightName,
        string memory _vows,
        uint256 _date
    ) public onlyNotary {
        marriages[_address].leftName = _leftName;
        marriages[_address].rightName = _rightName;
        marriages[_address].vows = _vows;
        marriages[_address].date = _date;
        marriages[_address].balance = 0;

        marriageList.push(_address);
    }

    // send money to contract, ammount is saved in couple balance
    function ringBell(address _address) public payable {
        marriages[_address].balance += msg.value;
        emit LogRingBell(_address, msg.value, getBalance());
    }

    // returns Contract-Balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // withdraw ether from contract to coupleaccount, only possible by couple
    function withdraw(address _address) public payable onlyCouple(_address) {
        payable(_address).transfer(marriages[_address].balance);
        marriages[_address].balance = 0;
    }

    // returns a list of all marriage addresses
    function getMarriageList() public view returns (address[] memory) {
        return marriageList;
    }

    // returns of a marriage
    function getMarriageDetails(address _address)
        public
        view
        returns (Marriage memory)
    {
        return marriages[_address];
    }
}
