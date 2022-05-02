class Verifier extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <button onClick={() => this.setState({ piaciuto: true })}>
                Mi Piace
            </button>
        );
    }
}