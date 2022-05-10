class New extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            enabled: false
        };
    }

    // Verifica che sia stata istanziata correttamente la libreria Web3; nel caso Metamask (o analogo) sia già abilitato ottiene direttamente gli indirizzi e abilita l'inserimento
    componentDidMount() {
        w3 && w3.eth.getAccounts().then(accounts => {
            if(accounts && accounts.length > 0)
                this.enabled(accounts[0]);
        })
    }

    // Abilita l'inserimento
    enabled(account) {
        this.setState({
            enabled: true,
            account: account
        });
    }

    render() {
        let content;

        if(this.state.enabled) {
            content = (<Inserter account={this.state.account}/>);
        } else {
            content = (<Enabler enabled={this.enabled} parent={this}/>);
        }

        return content;
    }
}