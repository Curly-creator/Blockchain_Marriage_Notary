from brownie import Marriage, accounts

# test to see that when we deploy our smart contract it starts off as 0 in that retrieve function.
# NEED TO BE UPDATED.
def test_deploy():
    # arrange: setting up all the pieces. Getting the account to make contract.
    account = accounts[0]
    # act
    # deploy the contract
    newmarriage = Marriage.deploy({'from': account})
    # retrieve the contract
    starting_value = newmarriage.getMarriageDetails()
    expected = 0
    # assert
    assert starting_value == expected
    # test it with brownie test.

# Test to check if it was updated with 15.
def test_updating_storage():
    # arrange
    account = accounts[0]
    # this is not the act that we are testing, that is why part of the setup
    newmarriage = Marriage.deploy({'from': account})
    # act
    expected = 15
    newmarriage.store(expected, {'from': account})
    # assert
    assert expected == newmarriage.retrieve()
    # assert 5 == newmarriage.retrieve()

# USEFUL TIPS/ COMMANDS
# basic: brownie test
# to test just one function brownie test -k test_updating_storage
# brownie test --pdb (to examine what really went wrong, why is the test failing). Enter quit() to terminate pdb
# brownie test -s: more robust in telling what went wrong. can also print lines.
# for more pytest documentation