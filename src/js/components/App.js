import React from 'React';
import Vhosts from './Vhosts';
import Sites from './Sites';
import Settings from './Settings';
import { openTab } from '../helpers';

class Navitem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span onClick={this.handleClick.bind(this)} className="Nav-item">{this.props.children}</span>
		)
	}

	handleClick() {
		this.props.onClick({
			title: this.props.children,
			view: this.props.view
		});
	}
}

class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.navitems = [
			{title: 'Vhosts', view: 'vhosts'},
			{title: 'Sites', view: 'sites'},
			{title: 'Settings', view: 'settings'},
		]

		this.state = {
			pos: {
				width: '100%',
				left: 0
			}
		}
	}

	componentDidMount() {
		this.setIndicatorTo("Vhosts");
	}

	render() {
		return (
			<nav className="Nav" ref="Nav">
				{this.navitems.map(item => <Navitem key={item.title} onClick={this.handleNavigate.bind(this)} view={item.view}>{item.title}</Navitem>)}
				<span style={{width: this.state.pos.width + 'px', left: this.state.pos.left + 'px'}} className="Nav-indicator"></span>
			</nav>
		)
	}

	handleNavigate(props) {
		this.setIndicatorTo(props.title)
		this.props.onNavigate(props);
	}

	setIndicatorTo(title) {
		const nav = this.refs.Nav;
		const items = Array.prototype.slice.call(nav.querySelectorAll('.Nav-item'));
		const item = items.find(i => i.innerText == title);

		this.setState({
			pos: {
				width: item.offsetWidth,
				left: item.offsetLeft
			}
		});
	}
}

class Notification extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="Notification">{this.props.children}</div>
		)
	}
}

class NotificationSystem extends React.Component {
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

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			view: 'sites'
		}
	}

	render() {
		const viewClass = "View View--" + this.state.view;
		return (
			<div className={viewClass}>
				<Nav onNavigate={this.loadView.bind(this)} initial={this.state.view} />
				{this.state.view == "vhosts" && <Vhosts />}
				{this.state.view == "sites" && <Sites />}
				{this.state.view == "settings" && <Settings />}
				<NotificationSystem ref="notifications" />
				<nav className="Nav Nav--base">
					<a className="Nav-item" onClick={this.openManager.bind(this)}>Open Host Manager</a>
				</nav>
			</div>
		)
	}

	loadView(props) {
		this.setState({ view: props.view});
	}

	openManager() {
		openTab('http://localhost:8080/host-manager/html/');
	}
}

export default App;
