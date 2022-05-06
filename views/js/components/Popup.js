class Popup extends React.Component {
    constructor(props) {
        super(props);

        this.myRef = React.createRef();
        this.deletePopup = this.props.deletePopup.bind(this.props.parent);
    }

    componentDidMount() {
        gsap.from(this.myRef.current, {opacity: 0});
        
        if(this.props.duration > 0)
            setTimeout(() => {
                gsap.to(this.myRef.current, {opacity: 0}).then(() => this.deletePopup(this.props.internalId));
            }, this.props.duration);
    }

    render() {
        let classes = 'popup';
        classes += ' popup-' + this.props.type;

        let style = {
            transform: 'translateY(' + (-this.props.height * 100) + 'px)'
        };

        let closeButton;

        if(this.props.duration == 0 && this.props.type !== 'loading')
            closeButton = <span className="popup-close" onClick={() => this.deletePopup(this.props.internalId)}>x</span>;

        return (
            <div className={classes} ref={this.myRef} style={style}>
                <div className="popup-inner">
                    <span className="popup-title">{this.props.title}</span>
                    <span className="popup-description">{this.props.description}</span>
                    {closeButton}
                </div>
            </div>
        );
    }
}