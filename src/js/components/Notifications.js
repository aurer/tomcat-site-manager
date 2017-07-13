import React from 'react';
import Notification from './Notification';

class Notifications extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: []
		}

		window.notify = this.addNotification.bind(this);
	}

	render() {
		return (
			<div className="Notifications">
				{this.state.messages && this.state.messages.map( n => <Notification key={n.uid}>{n.text}</Notification> )}
			</div>
		)
	}

	addNotification(message) {
		var newMessages = this.state.messages;
		var messageObject = {
			uid: new Date().getTime(),
			text: message
		}

		newMessages.unshift(messageObject);
		this.setState({
			messages: newMessages
		});

		setTimeout(this.removeNotification.bind(this), 2000);
	}

	removeNotification() {
		var newMessages = this.state.messages;
		newMessages.pop();
		this.setState({
			messages: newMessages
		});
	}
}

export default Notifications;
