from brownie import Contract, accounts, config, MarriageNotary, network

LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development","ganache-local"]

def deploy_Marriage(account):
    print("Deploying contract...")
    contract = MarriageNotary.deploy({"from": account}) 

    # --- EXAMPLES ----
    # Some examples on how to call functions from the Smart Contract
    # contract = Address from the deployed Smart Contract
    # account = Address of your account

def ringBell(contract, account, value):
    print("Ringing the bell! Ding Dong")
    contract.ringBell({"from": account, "value": value})

def getMarriageDetails(contract):
    print("Geting Marriage Details...")
    print(contract.getMarriageDetails())

def getBalance(contract):
    print("The Balance is:" ,contract.getBalance())

def collectMoney(contract, account):
    print("Getting richt...")
    contract.collect({"from": account})

def main():
    print("-- Start --")
    deploy_Marriage(accounts[0]) #accounts(0) = Account0 on your local Ganache-Blockchain
    
