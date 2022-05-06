class Popup extends React.Component {
    constructor(props) {
        super(props);

        this.myRef = React.createRef();
        this.deletePopup = this.props.deletePopup.bind(this.props.parent);
        this.startDying = this.startDying.bind(this);
    }

    componentDidMount() {
        gsap.from(this.myRef.current, {opacity: 0});
        
        if(this.props.duration > 0)
            setTimeout(() => {
                this.startDying()
            }, this.props.duration);
    }

    startDying() {
        gsap.to(this.myRef.current, {opacity: 0}).then(() => this.deletePopup(this.props.internalId));
    }

    render() {
        let classes = 'popup';
        classes += ' popup-' + this.props.type;

        let style = {
            transform: 'translateY(calc(' + (-this.props.height * 100) + '% + ' + (20 * this.props.height) + 'px))'
        };

        let closeButton;

        if(this.props.duration == 0 && this.props.type !== 'loading')
            closeButton = <span className="popup-close" onClick={() => this.startDying()}>x</span>;

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