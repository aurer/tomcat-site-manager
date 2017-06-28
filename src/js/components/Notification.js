import React from 'React';

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

	componentWillUnmount() {
		this.setState({
			top: 100
		});
	}

	render() {
		var style = {transform: "translateY(" + this.state.top + "%)"};

		return (
			<div style={style} className="Notification">{this.props.children}</div>
		)
	}
}

export default Notification;
