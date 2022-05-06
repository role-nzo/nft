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

        this.setState({
            waiting: true
        });

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
            success: (data) => {
                contract.methods.safeMint(this.props.account, data).send({ from: this.props.account }).then(async (data) => {
                    let receipt = await w3.eth.getTransactionReceipt(data.transactionHash);
                    alert("Token ID: " + Web3.utils.hexToNumber( receipt.logs[0].topics[3]) );
                    this.setState({
                        waiting: false
                    });
                });
            },
            error: () => {
                this.setState({
                    waiting: false
                });
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
            let classes = 'loading';

            if(this.state.waiting)
                classes += ' loading-show';
            content = (
                <div className="direction-column">
                    <input type="text" id="title" name="title" placeholder="Titolo"/>
                    <input type="text" id="author" name="author" placeholder="Autore/i"/>
                    <input type="text" id="description" name="description" placeholder="Descrizione"/>
                    <input type="file" id="image" name="image" placeholder="Immagine"/>
                    <input type="file" id="document" name="document" placeholder="Documento"/>
                    <button type="submit">Aggiungi</button>
                    <div className={classes}><img src="images/loading.gif"></img></div>
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