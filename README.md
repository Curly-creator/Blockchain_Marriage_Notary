# Smart Contract Notary

## Description
Marriage Notary using Smart Contract on Ethereum Blockchain. - A STUDENT PROJECT -

## Installation
To run the notary we highly recomment to use a test enviroment. Below you'll find a list of Tools we used for our development.

**!!! Don't use real Ether, there is no guarantee to get it back !!!**

[Solidity](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity): Ethereum Solidity Language for Visual Studio Code

[Python](https://www.python.org/downloads/): Python Language

[Ganache](https://trufflesuite.com/ganache/): virtual Blockchain

[Ganache-Cli](https://docs.nethereum.com/en/latest/ethereum-and-clients/ganache-cli/): Commandline integration for Ganache

[Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable): Client Server

[Brownie](https://eth-brownie.readthedocs.io/en/stable/install.html): Smart Contract Development Platform

[MetaMask](https://metamask.io/): Cryptho Wallet and Gateway to Blockchain-Apps. Used to handle Accounts and Transactions.

## Setup

To run the Marriage Notary in the test enviroment you have to install [Ganache](https://trufflesuite.com/ganache/), [Ganache-Cli](https://docs.nethereum.com/en/latest/ethereum-and-clients/ganache-cli/), [Brownie](https://eth-brownie.readthedocs.io/en/stable/install.html) and [MetaMask](https://metamask.io/). 

Make sure every component is installed correctly.

**1. Connect your local Ganache with Brownie by typing the following command into your commandline.**

brownie networks add Ethereum ganache-local host="_RPC-SERVER_" chainid:"_CHAIN_ID_"

_RPC-SERVER_: RPC-Server of your local Ganache. Default should be http://127.0.0.1:8545

_CHAIN_ID_: Network Id of your local Ganache. Default should be 1337

**2. Connect your Ganache to MetaMask and import an account.**

To do so, follow this [Guide](https://www.youtube.com/watch?v=lv4HEyiw4EQ). Make sure to import account[0]. Currently this is the only account that can interact with the Smart Contract.

**3. Install npx and Yarn by typing the following command into your commandline.**

npm install -g npx
npm install --global yarn

**4. Deploy the Smart Contract to your local Ganache-Blockchain. Therefore type the following command into the commandline.**

brownie run sripts/deploy.py --network ganache-local

**5. Start the WebApp by typing the following command into your commandline.**

yarn start

**!! You might need to restart the Terminal before it works !!**

## Usage

**1. Creating a new Marriage Contract**

Enter Marriage-Deatails into the Input-fields and press the _Submit_. On the right side a list of all created Marriages will be displayed.

_Wallet Address of the couple has to be a Wallet-Address from your local Ganache_

_Marriage Date hast to be in the following format: DDMMYYYY_

**2.Get Marriage Details**

Enter the Adress of a couple you want to get the Details from into _Adress of the couple_ and press _Get Details_. All the available Details will be displayed below.

**3.Ring the Bells**

By rining the bells you can send Ether to the Marriage Contract. Enter the Address you want to send Ether to into _Wallet Address of the couple_ and the amount of Ether into _Number of Wei's._

_Note: 1 Ether = 1e18 Wei_

**4.Withdraw**

To withdraw ether from the Smart Contract enter your Wallet-Address into _Wallet Address of the couple_ and press _Withdraw Ethers_.

_Note: Only the married couple can withdraw their ether. Currently you can only withdraw with account[0]. So make sure to use the right address._


## To do

- At the moment you can interact only with one account (account[0]) from local ganache) with the notary. 
Hardcoded in [App.js](smart-contract\main\client\src\App.js) in ringBell- and withdraw-function.

- Copybutton in Marriage List is currently not working

## Links to important Files
[Smart Contract](https://gitlab.rz.htw-berlin.de/s0577630/smart-contract/-/blob/main/contracts/MarriageContract.sol) Solidity Code for the Marriage Notary contract

[GUI](https://gitlab.rz.htw-berlin.de/s0577630/smart-contract/-/blob/main/client/src/App.js) React Code for our User Interface

[Deploy Script](https://gitlab.rz.htw-berlin.de/s0577630/smart-contract/-/blob/main/scripts/deploy.py) Python Code for deployment of the Smart Contract

## Authors
Anna von Blohn, Tanvi Shamra, Jonas Burger

## License
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

