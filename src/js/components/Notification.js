import React from 'react';

class Notification extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			top: 100
		}
	}

	componentDidMount() {
		var t = this;
		setTimeout(function(){
			t.setState({
				top: 0
			});
		}, 10);
	}

	render() {
		var style = {transform: "translateY(" + this.state.top + "%)"};

		return (
			<div style={style} className="Notification">{this.props.children}</div>
		)
	}
}

export default Notification;
