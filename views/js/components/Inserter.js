class Inserter extends React.Component {
    constructor(props) {
        super(props);

        this.insert = this.insert.bind(this);

        this.state = {
            minter: undefined,
            waiting: false
        };
    }

    componentDidMount() {
        this.verifyRole();
    }

    insert(event) {
        event.preventDefault();

        let popup_id_ipfs, popup_id_eth;

        const formData = new FormData();
        formData.append('title', event.target.querySelector("#title").value);
        formData.append('description', event.target.querySelector("#description").value);
        formData.append('author', event.target.querySelector("#author").value);
        formData.append('image', event.target.querySelector("#image").files[0]);
        formData.append('document', event.target.querySelector("#document").files[0]);
        
        jQuery.ajax({
            url: '/add',
            method: 'post',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: () => {
                popup_id_ipfs = getPopupper().addPopup("Adding data to the IPFS network", "Please wait...", 'loading', 0);
            },
            success: (data) => {
                getPopupper().addPopup("Data successfully added to the IPFS network", "Plase confirm the transaction to mint.", 'success', 10000);
                popup_id_eth = getPopupper().addPopup("Minting the NFT", "Please wait...", 'loading', 0);

                contract.methods.safeMint(this.props.account, data).send({ from: this.props.account }).then(async (data) => {
                    let receipt = await w3.eth.getTransactionReceipt(data.transactionHash);
                    let href = "/?tokenid="+ Web3.utils.hexToNumber( receipt.logs[0].topics[3]);
                    
                    getPopupper().addPopup("Certificate successfully added, Token ID: " + Web3.utils.hexToNumber( receipt.logs[0].topics[3]), (<a href={href}>Click here to see it</a>),'success', 0);
                }).catch(() => {
                    getPopupper().addPopup("Error adding the new certificate into the Ethereum Network", "Try again later", 'error', 10000);
                }).then(() => {
                    getPopupper().deletePopup(popup_id_eth);
                });
            },
            error: () => {
                getPopupper().addPopup("Connection to the IPFS network failed", "Try again", 'error', 5);
            },
            complete: () => {
                getPopupper().deletePopup(popup_id_ipfs);
            }
        });
    }

    verifyRole() {
        contract.methods.MINTER_ROLE().call().then(async (data) => {
            contract.methods.hasRole(data, this.props.account).call().then((isMinter) => {
                this.setState({
                    minter: isMinter
                });
            })
        });
    }

    enable(event) {
        event.preventDefault();

        if(window.ethereum) {
            window.ethereum.enable().then(function() {
                window.ethereum.request({ method: 'eth_requestAccounts' }).then(function(accounts) {
                    const account = accounts[0];
                    console.log(account)
                });
            });
        } else {
            this.setState({
                enabled: false,
                minter: false
            })
        }
    }

    render() {
        let content;

        if(this.state.minter === true) {
            content = (
                <div className="direction-column">
                    <input type="text" id="title" name="title" placeholder="Titolo"/>
                    <input type="text" id="author" name="author" placeholder="Autore/i"/>
                    <input type="text" id="description" name="description" placeholder="Descrizione"/>
                    <input type="file" id="image" name="image" placeholder="Immagine"/>
                    <input type="file" id="document" name="document" placeholder="Documento"/>
                    <button type="submit">Aggiungi</button>
                </div>
            );
        } else if(this.state.minter === false) {
            content = (
                <div>
                    <h3>Non hai i permessi necessari per aggiungere un nuovo certificato :(</h3>
                </div>
            );
        } else {
            content = (
                <div>
                    <h3>Caricamento in corso...</h3>
                </div>
            );
        }

        return (
            <form id="verifier" onSubmit={this.insert}>
                <h2>Aggiungi un nuovo certificato</h2>
                {content}
            </form>
        );
    }
}