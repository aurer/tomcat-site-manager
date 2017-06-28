import React from 'React';
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

		var self = this;
		setTimeout(function(){
			newMessages.pop();
			self.setState({
				messages: newMessages
			});
		}, 2000);
	}
}

export default Notifications;
