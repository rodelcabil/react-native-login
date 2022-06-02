import React from 'react';
import Pusher from 'pusher-js/react-native';
import pusherConfig from '../../pusher.json';
import ChatViewClass from '../Messaging/ChatViewClass'
import ChatView from '../chatView';
import { useRoute } from '@react-navigation/native';

export default class ChatClientClass extends React.Component {
  
  constructor(props) {


    super(props);
    this.state = {
      messages: [],
      date: '',
      uuid: '',
      roomId: `${this.props.roomId}`,
    };
  

    this.pusher = new Pusher(pusherConfig.key, pusherConfig); // (1)

    this.chatChannel = this.pusher.subscribe(this.state.roomId); // (2)
    this.chatChannel.bind('pusher:subscription_succeeded', () => { // (3)
      this.chatChannel.bind('chat', function(data) {
          console.log(data)
      });

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
    messages.push({ action: 'join', name: name, channelName: this.state.roomId });
    this.setState({
      messages: messages
    });
    console.log(name, " JOINED");
  }

  handlePart(name) { // (5)
    const messages = this.state.messages.slice();
    messages.push({ action: 'part', name: name, channelName: this.state.roomId  });
    this.setState({
      messages: messages
    });
  }



  handleMessage(name, message, date, uuid) { // (6)
    const messages = this.state.messages.slice();
    const ddate = this.state.date;
    const unique_id = this.state.uuid;
    messages.push({ action: 'message', name: name, message: message , date: date, uuid: uuid, channelName: this.state.roomId });
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
      uuid: uuid,
      channelName: this.state.roomId 
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
    const messages = this.props.groupMessage;
    const user_name = this.props.chatMateName;
    const type = this.props.type;
    const first_name = this.props.first_name;
    const last_name = this.props.last_name;
    const roomId = this.props.roomId;
    const userID = this.props.myID;
    //this.state.roomId = roomId;
    
    return (
        <ChatView message={ messages } onSendMessage={ this.handleSendMessage } name={user_name} type={type} first_name={first_name} last_name={last_name} roomId={roomId} userID={userID}/>
    );
  }
}