class Enabler extends React.Component {
    constructor(props) {
        super(props);

        this.enable = this.enable.bind(this);
        this.enabled = this.props.enabled.bind(this.props.parent);

        this.state = {
            enabled: undefined,
            minter: undefined
        };
    }

    enable(event) {
        event.preventDefault();

        if(window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
                if(accounts && accounts.length > 0 && accounts[0]) {
                    this.enabled(accounts[0]);
                }
            });
        }
    }

    render() {
        let content;

        if(window.ethereum) {
            content = (
                <div>
                    <button type="submit">Abilita</button>
                </div>
            );
        } else {
            content = (
                <div>
                    <h3><pre>window.ethereum</pre> non trovato</h3>
                </div>
            );
        }

        return (
            <form id="verifier" onSubmit={this.enable}>
                <h2>Aggiungi un nuovo certificato</h2>
                {content}
            </form>
        );
    }
}