class Verifier extends React.Component {
    constructor() {
        super();

        this.submit = this.submit.bind(this);
    }

    submit(event) {
        event.preventDefault();

        let id;
        
        jQuery.ajax({
            url: '/verify',
            method: 'post',
            data: {
                "certificate": event.target.querySelector("#verifierInput").value
            },
            beforeSend: (data) => {
                id = getPopupper().addPopup("Connection to the server", "Please wait...", 'loading', 0);
            },
            success: (data) => {
                getPopupper().deletePopup(id);

                if(data == "notfound")
                    getPopupper().addPopup("Certificate not found", "Try another ID", 'error', 5000);
                else if(data == "error")
                    getPopupper().addPopup("Error", "Try again later", 'error', 5000);
                else
                    this.retrieveIPFSData(data.split("ipfs://")[1]);
            },
            error: (data) => {
                getPopupper().addPopup("Connection to the server failed", "Try again", 'error', 5);
            }
        });

    }

    retrieveIPFSData(cid) {
        let id;

        jQuery.ajax({
            url: 'https://ipfs.io/ipfs/' + cid,
            method: 'get',
            beforeSend: (data) => {
                id = getPopupper().addPopup("Connection to the IPFS network", "Please wait...", 'loading', 0);
            },
            success: (data) => {
                getPopupper().deletePopup(id);
                getPopupper().addPopup("Certificate found!", `Title: ${data.name}\nDescription: ${data.description}\nAuthor(s): ${data.properties.custom.author}`, 'success', 0);
            },
            error: (data) => {
                getPopupper().addPopup("Connection to the IPFS network failed", "Try again", 'error', 5);
            }
        });
    }

    render() {
        return (
            <form id="verifier" onSubmit={this.submit}>
                <h2>Cerca e verifica certificati</h2>
                <input type="text" id="verifierInput" name="verifierInput"/>
                <button type="submit">Verifica</button>
            </form>
        );
    }
}