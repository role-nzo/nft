class Verifier extends React.Component {
    constructor() {
        super();

        this.submit = this.submit.bind(this);
    }

    submit(event) {
        if(event)
            event.preventDefault();

        let id;
        
        jQuery.ajax({
            url: '/verify',
            method: 'post',
            data: {
                "certificate": document.querySelector("#verifierInput").value
            },
            beforeSend: (data) => {
                id = getPopupper().addPopup("Connection to the server", "Please wait...", 'loading', 0);
                document.querySelector("#verifierButton").disabled = true;
            },
            success: (data) => {
                if(data == "notfound")
                    getPopupper().addPopup("Certificate not found", "Try another ID", 'error', 5000);
                else if(data == "error")
                    getPopupper().addPopup("Error", "Try again later", 'error', 5000);
                else if(data == "invalid")
                    getPopupper().addPopup("Invalid certificate", "Try another ID", 'error', 5000);
                else
                    this.retrieveIPFSData(data.split("ipfs://")[1]);
            },
            error: (data) => {
                getPopupper().addPopup("Connection to the server failed", "Try again", 'error', 5);
            },
            complete: (data) => {
                getPopupper().deletePopup(id);
                document.querySelector("#verifierButton").disabled = false;
            }
        });

    }

    retrieveIPFSData(cid) {
        let id;

        jQuery.ajax({
            url: 'https://ipfs.io/ipfs/' + cid,
            method: 'get',
            beforeSend: () => {
                id = getPopupper().addPopup("Connection to the IPFS network", "Please wait...", 'loading', 0);
            },
            success: (data) => {
                console.log(data)
                getPopupper().addPopup("",
                    (<div className="popup-static-content">
                        <div className="popup-img">
                            <img src={"https://ipfs.io/ipfs/" + data.image.split("ipfs://")[1]}/>
                        </div>
                        <div className="popup-static-inner">
                            <span className="popup-static-title">{data.name}</span>
                            <span className="popup-static-author">{data.properties.custom.author}</span>
                            <span className="popup-static-description">{data.description}</span>
                        </div>
                        <div className="popup-bottom">
                            <a href={"https://ipfs.io/ipfs/" + data.properties.custom.document.split("ipfs://")[1]}>View document</a>
                        </div>
                    </div>)
                    , 'static', 0);
            },
            error: () => {
                getPopupper().addPopup("Connection to the IPFS network failed", "Try again", 'error', 5);
            },
            complete: () => {
                getPopupper().deletePopup(id);
            }
        });
    }

    render() {
        return (
            <form id="verifier" onSubmit={this.submit}>
                <h2>Cerca e verifica certificati</h2>
                <input type="text" id="verifierInput" name="verifierInput"/>
                <button type="submit" id="verifierButton">Verifica</button>
            </form>
        );
    }
}