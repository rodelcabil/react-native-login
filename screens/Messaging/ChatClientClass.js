import React from 'react';
import Pusher from 'pusher-js/react-native';
import pusherConfig from '../../pusher.json';
import ChatViewClass from '../Messaging/ChatViewClass'
import ChatView from '../chatView';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default class ChatClientClass extends React.Component {

  constructor(props) {


    super(props);
    this.state = {
      messages: [],
      chat: '',
      date: '',
      sender_id: '',
      roomId: `${this.props.roomId}`,
    };

   
    this.pusher = new Pusher(pusherConfig.key, pusherConfig); // (1)

    this.chatChannel = this.pusher.subscribe(this.state.roomId); // (2)
    this.chatChannel.bind('pusher:subscription_succeeded', () => { // (3)
      this.chatChannel.bind('chat', function (data) {
        console.log(data)
      });

      this.chatChannel.bind('join', (data) => { // (4)
        this.handleJoin(data.name);
      });
      this.chatChannel.bind('part', (data) => { // (5)
        this.handlePart(data.name);
      });
      this.chatChannel.bind('message', async () => { // (6)
        await axios.get(
          `${pusherConfig.restServer}/api/chat/client-group-message?group_id=${this.props.roomId}`,
          {
              headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + tokenget
              },
          }).then(response => {
            this.setState({ 
              messages: response.data
            })
            
  
  
          })
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
    messages.push({ action: 'part', name: name, channelName: this.state.roomId });
    this.setState({
      messages: messages
    });
  }



  async handleMessage(message, sender_id, roomId) { // (6)

    const messages = this.state.messages.slice();
    messages.push({ 
      group_id: roomId,
      sender_id: sender_id,
      message: message,
      created_at: new Date.now,
      updated_at:  new Date.now
     });
    this.setState({
      messages: messages,
      
    });
    console.log(" MMessage", message, 'room id: ', roomId, "sender_id: ", sender_id);
   
  }

  async componentDidMount() { // (7)
    fetch(`${pusherConfig.restServer}/users/${this.props.name}`, {
      method: 'PUT'
    });
    const token = await AsyncStorage.getItem('token');
    const tokenget = token === null ? route.params.token : token;
    await axios.get(
        `${pusherConfig.restServer}/api/chat/client-group-message?group_id=${this.props.roomId}`,
        {
            headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + tokenget
            },
        }).then(response => {
          this.setState({ 
            messages: response.data
          })
          


        })
  }

  componentWillUnmount() { // (8)
    fetch(`${pusherConfig.restServer}/users/${this.props.name}`, {
      method: 'DELETE'
    });
  }

  async onSendMessage(text,sender_id, roomId) { // (9)
    const token = await AsyncStorage.getItem('token');
    const tokenget = token === null ? route.params.token : token;
    console.log("called onSendMessage");
    console.log("User ID:", sender_id, "Room ID: ", roomId, "Message:", text);
    const payload = {
      message: text,
      sender_id: sender_id,
      channelName: this.state.roomId
    };
    try {

      const resp = await axios({
        method: 'post',
        url: `${pusherConfig.restServer}/api/chat/group/${roomId}`,
        data: {
          sender_id: sender_id,
          message: text,
        },
        body: JSON.stringify(payload),
        headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + tokenget, },
      });

      if (resp.status === 200) {

        console.log(resp.data);

       
        await axios.get(
          `${pusherConfig.restServer}/api/chat/client-group-message?group_id=${roomId}`,
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + tokenget
            },
          }).then(response => {
            
            this.setState({ 
              messages: response.data
            })
      })


    }
    }
  catch(error) {
    console.log(error);
  }

    console.log(text, " Room ID: ", roomId, 'uuid: ', sender_id);
}

//  onSendMessage(text, date, uuid, roomId) { // (9)
//   const payload = {
//     message: text,
//     date: date,
//     uuid: uuid,
//     channelName: this.state.roomId
//   };
//   try {
//     fetch(`${pusherConfig.restServer}/users/${this.props.name}/messages`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(payload)
//     })
//   }
//   catch (error) {
//     console.log(error);
//   }
//   console.log(text, " Time: ", date, 'uuid: ', uuid);
// }



render() {
  // const messages = this.props.groupMessage;
  const user_name = this.props.chatMateName;
  const type = this.props.type;
  const first_name = this.props.first_name;
  const last_name = this.props.last_name;
  const roomId = this.props.roomId;
  const userID = this.props.myID;
  //this.state.roomId = roomId;

  return (
    <ChatView message={this.state.messages} onSendMessage={this.handleSendMessage} name={user_name} type={type} first_name={first_name} last_name={last_name} roomId={roomId} userID={userID} />
  );
}
}