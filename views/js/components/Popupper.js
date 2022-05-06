class Popupper extends React.Component {
    constructor() {
        super();

        this.id = 0;

        this.state = {
            popups: []
        };

        this.addPopup = this.addPopup.bind(this);
    }

    addPopup(title, description, type, duration) {
        let popups = this.state.popups;

        let id = this.id;

        this.setState({
            popups: [...popups, {
                id: id,
                title: title,
                description: description,
                type: type,
                duration: duration
            }]
        });

        this.id = (this.id + 1) % 100;

        return id;
    }

    deletePopup(id) {
        let popups = this.state.popups;
        
        popups.splice(popups.indexOf(popups.find(popup => popup.id == id)), 1);

        this.setState({
            popups: popups
        });
    }

    render() {
        return (
            <div>
                {this.state.popups.map(popup =>
                    <Popup
                        key={popup.id}
                        internalId={popup.id}
                        id={"popup-"+popup.id}
                        title={popup.title}
                        description={popup.description}
                        type={popup.type}
                        deletePopup={this.deletePopup}
                        duration={popup.duration}
                        parent={this}
                        height={this.state.popups.indexOf(popup)} 
                    />)}
            </div>
        );
    }
}