import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

var timeouts = [];

class Message extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			messages: []
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.message) {
			return;
		}
		var messages = this.state.messages;
		messages.push(nextProps.message);
		this.setState({messages});
		this.handleRemoveMessages(messages.length);
	}

	render() {
		var activeState = this.state.active ? 'is-active' : 'is-inactive';

		return (
			<div className="Messages">
			<ReactCSSTransitionGroup
				transitionName="messageTransition"
				transitionEnterTimeout={500}
				transitionLeaveTimeout={300}>
				{this.state.messages.map((message, i) => {
					var className = `Message Message--${message.type}`;
					return <div key={i} className={className}>{message.text}</div>
				})}
			</ReactCSSTransitionGroup>
			</div>
		)
	}

	handleRemoveMessages(id) {
		if (timeouts[id]) {
			clearTimeout(timeouts[id]);
		}

		timeouts[id] = setTimeout(this.removeMessage.bind(this), 3000);
	}

	removeMessage() {
		let messages = this.state.messages;
		messages.shift();
		this.setState({messages});
		this.props.clearMessages();
	}
}

export default Message
