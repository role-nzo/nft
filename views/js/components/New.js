class New extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            enabled: false
        };
    }

    componentDidMount() {
        w3 && w3.eth.getAccounts().then(accounts => {
            if(accounts && accounts.length > 0)
                this.enabled(accounts[0]);
        })
    }

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