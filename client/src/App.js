import React, { Component } from "react"
import './App.css'
import { getWeb3 } from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import { getEthereum } from "./getEthereum"

class App extends Component {

    state = {
        // -- Configuration
        web3: null,
        accounts: null,
        chainid: null,
        marriage: null,
        marriageList: null,


        // -- Inputs
        adressInput: null,
        leftNameInput: '',
        rightNameInput: '',
        etherInput: 0,
        vowInput: '',
        marriageDateInput: 22062022,

        // -- Values
        addressValue: null,
        leftNameValue: null,
        rightNameValue: null,
        vowValue: null,
        marriageDateValue: null,
        balanceMarriageValue: 0,
        balanceNotaryValue: 0,
    }


    componentDidMount = async () => {

        // Get network provider and web3 instance.
        const web3 = await getWeb3()

        // Try and enable accounts (connect metamask)
        try {
            const ethereum = await getEthereum()
            ethereum.enable()
        } catch (e) {
            console.log(`Could not enable accounts. Interaction with contracts not available.
            Use a modern browser with a Web3 plugin to fix this issue.`)
            console.log(e)
        }

        // Use web3 to get the user's accounts and connect with metamask.. connecting to ethereum via metamask basically
        const accounts = await web3.eth.getAccounts()

        // Get the current chain id
        const chainid = parseInt(await web3.eth.getChainId())

        this.setState({
            web3,
            accounts,
            chainid
        }, await this.loadInitialContracts)

    }

    // --- Configuration Functions ---

    loadInitialContracts = async () => {

        var _chainID = this.state.chainid

        const marriage = await this.loadContract(_chainID, "MarriageNotary")

        if (!marriage) {
            return
        }

        this.setState({
            marriage: marriage
        })
    }

    loadContract = async (chain, contractName) => {
        // Load a deployed contract instance into a web3 contract object
        const { web3 } = this.state

        // Get the address of the most recent deployment from the deployment map
        let address
        try {
            address = map[chain][contractName][0]
        } catch (e) {
            console.log(`Couldn't find any deployed contract "${contractName}" on the chain "${chain}".`)
            return undefined
        }

        // Load the artifact with the specified address
        let contractArtifact
        try {
            contractArtifact = await import(`./artifacts/deployments/${chain}/${address}.json`)
        } catch (e) {
            console.log(`Failed to load contract artifact "./artifacts/deployments/${chain}/${address}.json"`)
            return undefined
        }

        return new web3.eth.Contract(contractArtifact.abi, address)
    }

    // --- Marriage Functions ---

    // Adds a marriage to the contract
    addMarriage = async (e) => {
        const { accounts, marriage, addressInput, leftNameInput, vowInput, rightNameInput, marriageDateInput } = this.state
        e.preventDefault()

        await marriage.methods.addMarriage(addressInput, leftNameInput, rightNameInput, vowInput, marriageDateInput).send({ from: accounts[0] }) //account[0] = contract Owner (Notary)

        var marriageList = await marriage.methods.getMarriageList().call()

        this.setState({
            marriageList: marriageList
        })
    }

    // Ring the bell to send ether to a couple
    ringBell = async (e) => {
        const { accounts, marriage, addressInput, etherInput } = this.state
        e.preventDefault()
        await marriage.methods.ringBell(addressInput).send({ from: accounts[0], value: etherInput }) //account[0] should be any account

        var balanceNotaryValue = await marriage.methods.getBalance().call()

        this.setState({
            balanceNotaryValue: balanceNotaryValue
        })
    }

    // Withdraws all the ether from the Contract to the Couple-Account (Only allowed to withdraw by couple)
    withdraw = async (e) => {
        const { accounts, marriage, addressInput } = this.state
        e.preventDefault()

        await marriage.methods.withdraw(addressInput).send({ from: addressInput })

        var balanceMarriageValue = await marriage.methods.getBalance().call() //check if Marriage Balance or Contract Balance

        this.setState({
            balanceMarriageValue: balanceMarriageValue
        })
    }

    // Get Details of a specific Marriage Couple by their AccoutAddress
    getMarriageDetails = async (e) => {
        const { marriage, addressInput } = this.state
        e.preventDefault()

        var marriageDetails = await marriage.methods.getMarriageDetails(addressInput).call()

        this.setState({
            leftNameValue: marriageDetails.leftName,
            rightNameValue: marriageDetails.rightName,
            vowValue: marriageDetails.vows,
            marriageDateValue: marriageDetails.date,
            balanceValue: marriageDetails.balance
        })
    }

    // --- Helper Functions ---

    adressTable() {
        const { marriageList } = this.state

        let table = []
        if (marriageList) {
            for (let i = 0; i < marriageList.length; i++) {
                let marriage = []
                let buttonId = "button" + i
                let cellId = "cell" + i
                marriage.push(<td id={cellId}>{marriageList[i]}</td>)
                marriage.push(<td><button id={buttonId} className="badge bg-primary">Copy</button></td>)
                table.push(<tr>{marriage}</tr>)
            }
        }
        return table
    }

    detailTable() {
        const { leftNameValue, rightNameValue, vowValue, marriageDateValue, balanceValue } = this.state

        let table = []
        if (vowValue) {                          //looking for a better solution
            let details = []
            details.push(<tr><td className="table-primary">First Person:</td><td>{leftNameValue}</td></tr>)
            details.push(<tr><td className="table-primary">Second Person:</td><td>{rightNameValue}</td></tr>)
            details.push(<tr><td className="table-primary">Vows:</td><td>{vowValue}</td></tr>)
            details.push(<tr><td className="table-primary">Marriage date:</td><td>{marriageDateValue}</td></tr>)
            details.push(<tr><td className="table-primary">Balance:</td><td>{balanceValue}</td></tr>)
            table.push(<tr>{details}</tr>)
        }
        return table
    }

    handleCopy(clickedId) {
        const { marriageList } = this.state
        if (marriageList) {
            let test = String(clickedId)
            let index = test.split('n').pop()
            let cellId = "cell" + index
            navigator.clipboard.writeText(document.getElementById(cellId).innerHTML)
        }
    }

    // --- Render ---

    render() {
        const {
            web3, chainid, accounts, marriage, addressInput, leftNameInput, rightNameInput, vowInput, marriageDateInput, etherInput, balanceMarriageValue, balanceNotaryValue, leftNameValue, rightNameValue, vowValue, marriageDateValue
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid)) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!marriage) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false

        return (<div className="App">
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }

            <div class="body">
                <h1 className="header">Standesamt Schoeneweide</h1>

                <h1 className="intro">Welcome to Germany's first digital notary</h1>

                <h2 className="cm">Create a marriage application</h2>

                <div className="submit">

                    <form onSubmit={(e) => this.addMarriage(e)}>
                        <div>
                            <label>Wallet Address of the couple: </label>
                            <br />
                            <input className="form-control"
                                name="addressInput"
                                type="text"
                                value={addressInput}
                                onChange={(e) => this.setState({ addressInput: e.target.value })}
                            />
                            <br />
                            <label>First Person: </label>
                            <br />
                            <input className="form-control"
                                name="leftNameInput"
                                type="text"
                                value={leftNameInput}
                                onChange={(e) => this.setState({ leftNameInput: e.target.value })}
                            />
                            <br />
                            <label>Second Person: </label>
                            <br />
                            <input className="form-control"
                                name="rightNameInput"
                                type="text"
                                value={rightNameInput}
                                onChange={(e) => this.setState({ rightNameInput: e.target.value })}
                            />
                            <br />
                            <label>Vows: </label>
                            <br />
                            <input className="form-control"
                                name="vowInput"
                                type="text"
                                value={vowInput}
                                onChange={(e) => this.setState({ vowInput: e.target.value })}
                            />
                            <br />
                            <label>Marriage Date: </label>
                            <br />
                            <input className="form-control"
                                name="marriageDate"
                                type="text"
                                value={marriageDateInput}
                                onChange={(e) => this.setState({ marriageDate: e.target.value })}
                            />
                            <br />
                            <button type="submit" class="btn btn-outline-secondary" disabled={!isAccountsUnlocked}>Submit</button>
                        </div>
                    </form>
                </div>

                <div class="card border-secondary mb-3 addressTable">
                    <table>{this.adressTable()}</table>
                </div>

                <div class="details">
                    <h2>Information about a specific couple</h2>
                    <form onSubmit={(e) => this.getMarriageDetails(e)}>
                        <div>
                            <label>Address of the couple: </label>
                            <br />
                            <input className="form-control"
                                name="addressInput"
                                type="text"
                                value={addressInput}
                                onChange={(e) => this.setState({ addressInput: e.target.value })}
                            />
                            <br />
                            <button type="submit" class="btn btn-outline-secondary" disabled={!isAccountsUnlocked}>Get Details</button>
                        </div>
                        <br />
                        <table className="table table-hover">
                            {this.detailTable()}
                        </table>
                    </form>
                </div>

                <div class="ringBell">
                    <h2>Ring the Bells and send money to your couple</h2>
                    <form onSubmit={(e) => this.ringBell(e)}>
                        <div>
                            <label>Wallet Address of the couple:</label>
                            <br />
                            <input className="form-control"
                                name="addressInput"
                                type="text"
                                value={addressInput}
                                onChange={(e) => this.setState({ addressInput: e.target.value })}
                            />
                            <br />
                            <label>Number of Wei's (1 Ether = 1e18 Wei) you want to send:</label>
                            <br />
                            <input className="form-control"
                                name="etherInput"
                                type="text"
                                value={etherInput}
                                onChange={(e) => this.setState({ etherInput: e.target.value })}
                            />
                            <br />
                            <button type="submit" class="btn btn-outline-secondary" disabled={!isAccountsUnlocked}>Ring the bell and send ether</button>
                        </div>
                    </form>
                </div>

                <div class="withdraw">
                    <h2>Newly weds get rich</h2>
                    <form onSubmit={(e) => this.withdraw(e)}>
                        <div>
                            <label>Wallet Address of the couple: </label>
                            <br />
                            <input className="form-control"
                                name="addressInput"
                                type="text"
                                value={addressInput}
                                onChange={(e) => this.setState({ addressInput: e.target.value })}
                            />
                            <br />
                            <button class="btn btn-outline-secondary" type="submit" disabled={!isAccountsUnlocked}>Withdraw Ethers</button>
                        </div>
                    </form>
                </div>
                <div className="doggo">
                    <img src="https://ethereum.org/static/5dea0acbc8484c42006d7bbed32fa019/ab960/doge-computer.webp"></img>
                </div>
            </div>
        </div>)
    }
}

export default App
