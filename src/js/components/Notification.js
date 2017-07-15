import React from 'react';

class Notification extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			top: 100,
			opacity: 0
		}
	}

	componentDidMount() {
		var t = this;
		// Slide in
		setTimeout(function(){
			t.setState({
				top: 0,
				opacity: 1
			});
		}, 10);

		// Slide out
		setTimeout(function() {
			t.setState({
				top: 100,
				opacity: 0
			});
		}, 1800);
	}

	render() {
		var style = {transform: "translateY(" + this.state.top + "%)", opacity: this.state.opacity};

		return (
			<div style={style} className="Notification">{this.props.children}</div>
		)
	}
}

export default Notification;
