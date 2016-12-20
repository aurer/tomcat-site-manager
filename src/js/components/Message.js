import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const TIMEOUTS = [];

class Message extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			messages: []
		}
	}

	componentWillReceiveProps(nextProps) {
		var messages = this.state.messages;
		if (nextProps.message) {
			messages.push(nextProps.message);
		} else {
			messages.shift();
		}
		this.setState({messages});
		this.handleRemoveMessages(messages.length);
	}

	render() {
		var activeState = this.state.active ? 'is-active' : 'is-inactive';
		return (
			<ReactCSSTransitionGroup
				transitionName="messageTransition"
				transitionEnterTimeout={500}
				transitionLeaveTimeout={300}>
				{this.state.messages.map((message, i) => {
					var className = `Message Message--${message.type}`;
					return <div key={i} className={className}>{message.text}</div>
				})}
			</ReactCSSTransitionGroup>
		)
	}

	handleRemoveMessages(id) {
		if (TIMEOUTS[id]) {
			clearTimeout(TIMEOUTS[id]);
		}

		TIMEOUTS[id] = setTimeout(this.removeMessage.bind(this), 3000);
	}

	removeMessage() {
		this.props.removeMessage();
	}
}

export default Message
