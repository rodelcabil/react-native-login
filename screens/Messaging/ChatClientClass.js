import React from 'react';
import Pusher from 'pusher-js/react-native';
import { StyleSheet, Text, KeyboardAvoidingView, View } from 'react-native';

import pusherConfig from '../../pusher.json';
import ChatView from '../chatView';
import ChatViewClass from '../Messaging/ChatViewClass'

export default class ChatClientClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      date: '',
      uuid: ''
    };
    this.pusher = new Pusher(pusherConfig.key, pusherConfig); // (1)

    this.chatChannel = this.pusher.subscribe('chat_channel'); // (2)
    this.chatChannel.bind('pusher:subscription_succeeded', () => { // (3)
      this.chatChannel.bind('join', (data) => { // (4)
        this.handleJoin(data.name);
      });
      this.chatChannel.bind('part', (data) => { // (5)
        this.handlePart(data.name);
      });
      this.chatChannel.bind('message', (data) => { // (6)
        this.handleMessage(data.name, data.message, data.date, data.uuid);
      });
    });

    this.handleSendMessage = this.onSendMessage.bind(this); // (9)
  }

  handleJoin(name) { // (4)
    const messages = this.state.messages.slice();
    messages.push({ action: 'join', name: name });
    this.setState({
      messages: messages
    });
    console.log(name, " JOINED");
  }

  handlePart(name) { // (5)
    const messages = this.state.messages.slice();
    messages.push({ action: 'part', name: name });
    this.setState({
      messages: messages
    });
  }

  handleMessage(name, message, date, uuid) { // (6)
    const messages = this.state.messages.slice();
    const ddate = this.state.date;
    const unique_id = this.state.uuid;
    messages.push({ action: 'message', name: name, message: message , date: date, uuid: uuid});
    this.setState({
      messages: messages,
      date: ddate,
      uuid: unique_id
    });
    console.log("name", name, " message", message, 'date: ', date, "uuid: ", uuid);
  }

  componentDidMount() { // (7)
    fetch(`${pusherConfig.restServer}/users/${this.props.name}`, {
      method: 'PUT'
    });
  }

  componentWillUnmount() { // (8)
    fetch(`${pusherConfig.restServer}/users/${this.props.name}`, {
      method: 'DELETE'
    });
  }

  onSendMessage(text, date, uuid) { // (9)
    console.log("called onSendMessage");
    const payload = {
      message: text,
      date: date,
      uuid: uuid
    };
    try {
      fetch(`${pusherConfig.restServer}/users/${this.props.name}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
    }
    catch (error) {
      console.log(error);
    }

    console.log(text, " Time: ", date, 'uuid: ', uuid);
  }

  render() {
    const messages = this.state.messages;

    return (
        <ChatViewClass messages={ messages } onSendMessage={ this.handleSendMessage } name={this.props.name} />
    );
  }
}