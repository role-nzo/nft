class Home extends React.Component {
    constructor() {
        super();

        this.verifier = React.createRef();
    }

    componentDidMount() {
        const tokenid = new URLSearchParams(window.location.search).get('tokenid');

        if(tokenid && !isNaN(tokenid)) {
            document.querySelector("#verifierInput").value = tokenid;
            this.verifier.current.submit();
        }
            
    }

    render() {
        return (
            <Verifier ref={this.verifier}/>
        );
    }
}