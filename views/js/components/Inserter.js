// Una volta abilitato Metamask questo componente controlla se l'utente ha i permessi (MINTER_ROLE) per poter aggiungere un certificato;
//  Se li possiede mostra i parametri d'inserimento
class Inserter extends React.Component {
    constructor(props) {
        super(props);

        this.handleFileChange = this.handleFileChange.bind(this);
        this.insert = this.insert.bind(this);

        this.state = {
            minter: undefined,
            waiting: false
        };
    }

    // Una volta creato l'oggetto viene controllato se l'utente possiede i permessi
    componentDidMount() {
        this.verifyRole();
    }

    handleFileChange(event) {
        let fakeInput = document.querySelector(`[for=${event.target.id}] .fake-input`);
        fakeInput.classList.remove("placeholder");
        fakeInput.innerHTML = event.target.value.split("\\").at(-1);
    }

    // Inserimento del nuovo certificato. Flusso:
    //  client --> server (per l'aggiunta dei dati su IPFS)
    //  server --> client (URL del descrittore JSON in IPFS, in caso di successo)
    //  client --> Ethereum (chiamato safeMint sul contratto per il minting di un nuovo NFT)
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
                
                contract.methods.safeMint(this.props.account, data).send({ from: this.props.account })
                    .on('transactionHash', () => { console.log('transactionHash'); console.time('Safe Mint') } )
                    .on('receipt', () => console.timeEnd('Safe Mint'))
                    .then(async (data) => {
                    console.log(`Gas Used: ${data.gasUsed}`);
                    
                    // Per ottenere indietro il tokenId del nuovo NFT
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
                getPopupper().addPopup("Error", "Try again", 'error', 5000);
            },
            complete: () => {
                getPopupper().deletePopup(popup_id_ipfs);
            }
        });
    }

    // Viene verificato che l'utente possieda i permessi necessari. Flusso:
    //  client --> Ethereum (MINTER_ROLE(): chiede l'hash associato al ruolo MINTER_ROLE)
    //  client --> Ethereum (hasRole(): verifica che l'utente possieda il ruolo MINTER_ROLE)
    verifyRole() {
        contract.methods.MINTER_ROLE().call().then(async (data) => {
            contract.methods.hasRole(data, this.props.account).call().then((isMinter) => {
                this.setState({
                    minter: isMinter
                });
            })
        });
    }

    /*enable(event) {
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
    }*/

    render() {
        let content;

        if(this.state.minter === true) {
            content = (
                <div className="direction-column">
                    <input type="text" id="title" name="title" placeholder="Titolo"/>
                    <input type="text" id="author" name="author" placeholder="Autore/i"/>
                    <input type="text" id="description" name="description" placeholder="Descrizione"/>
                    <label htmlFor="image" className="file-upload">
                        <div className="fake-input placeholder">Immagine</div>
                        <button className="fake-button" type="button">Sfoglia</button>
                    </label>
                    <input type="file" id="image" name="image" placeholder="Immagine" onChange={this.handleFileChange}/>
                    <label htmlFor="document" className="file-upload">
                        <div className="fake-input placeholder">Documento</div>
                        <button className="fake-button" type="button">Sfoglia</button>
                    </label>
                    <input type="file" id="document" name="document" placeholder="Documento" onChange={this.handleFileChange}/>
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