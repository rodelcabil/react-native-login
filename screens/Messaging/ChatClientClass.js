import React from 'react';
import Pusher from 'pusher-js/react-native';
import pusherConfig from '../../pusher.json';
import ChatViewClass from '../Messaging/ChatViewClass'
import ChatView from '../chatView';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import uuid from 'react-native-uuid';
import { update } from 'lodash';


export default class ChatClientClass extends React.Component {

  constructor(props) {


    super(props);
    this.state = {
      messages: [],
      loader: true,
      name: '',
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
      this.chatChannel.bind('message', (data) => { // (6)
        this.handleMessage(data.id, data.message, data.sender_id, data.roomId, data.created_at, data.updated_at, data.first_name, data.last_name, data.channelName,);
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



  async handleMessage(id, message, sender_id, roomId, created_at, updated_at, first_name, last_name) { // (6)
    const messages = this.state.messages.slice();
    messages.push({
      created_at: created_at,
      first_name: first_name,
      group_id: roomId,
      id: id,
      last_name: last_name,
      message: message,
      sender_id: sender_id,
      updated_at: updated_at,
    });
   
    this.setState({
      messages: messages,
    });

  }

  async componentDidMount() { // (7)
    
    console.log("MY NAME", this.props.name)
    const token = await AsyncStorage.getItem('token');
    const tokenget = token === null ? route.params.token : token;
    await axios.get(
      `https:beta.centaurmd.com/api/chat/client-group-message?group_id=${this.props.roomId}`,
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

    await axios.get(
      `https://beta.centaurmd.com/api/users/${this.props.clientID}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + tokenget
        },
      }).then(response => {

        const tempArr = [];
        response.data.map((user) => {
          const userID = user.id;


          this.state.messages.map((item) => {
            const senderID = item.sender_id;

            if (senderID === userID) {
              tempArr.push({
                ...item,
                first_name: user.first_name,
                last_name: user.last_name
              })
            }

          })
        
          return tempArr
        })

        let sort = tempArr.sort(function (a, b) {
          return (a.created_at > b.created_at) - (a.created_at < b.created_at);
        });
        console.log("MOUNTED SORTED DATA:", sort)
        this.setState({
          messages: sort,
          loader: false,
          name: this.props.name
        })
       
      })
      fetch(`${pusherConfig.restServer}/users/${this.state.name}`, {
        method: 'PUT'
      });
  }

  async componentWillUnmount() { // (8)
   

    console.log("MY NAME: ", this.props.name)
    const token = await AsyncStorage.getItem('token');
    const tokenget = token === null ? route.params.token : token;
    await axios.get(
      `https:beta.centaurmd.com/api/chat/client-group-message?group_id=${this.props.roomId}`,
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

    await axios.get(
      `https://beta.centaurmd.com/api/users/${this.props.clientID}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + tokenget
        },
      }).then(response => {

       

        const tempArr = [];
        response.data.map((user) => {
          const userID = user.id;


          this.state.messages.map((item) => {
            const senderID = item.sender_id;

            if (senderID === userID) {
              tempArr.push({
                ...item,
                first_name: user.first_name,
                last_name: user.last_name
              })
            }

          })
         
          return tempArr
        })


        let sort = tempArr.sort(function (a, b) {
          return (a.created_at > b.created_at) - (a.created_at < b.created_at);
        });
        console.log("UNMOUNTED SORTED DATA:", sort)
        this.setState({
          messages: sort,
          loader: false,
          name: this.state.name
        })
      
      })
      fetch(`${pusherConfig.restServer}/users/${this.state.name}`, {
        method: 'DELETE'
      });
  }


  async onSendMessage(id, message, sender_id, created_at, updated_at, roomId, first_name, last_name) { // (9)

    console.log("called onSendMessage");
    const payload = {
      id: id,
      group_id: roomId,
      sender_id: sender_id,
      message: message,
      created_at: created_at,
      updated_at: updated_at,
      first_name: first_name,
      last_name: last_name,
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
    console.log("Message: ", message, "Message ID: ", id, "Sender ID: ", sender_id, 'Created at: ', created_at, 'Updated at: ', updated_at, 'Group ID: ', roomId, 'First Name: ', first_name, 'Last Name: ', last_name);
  }



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
      <ChatView message={this.state.messages} onSendMessage={this.handleSendMessage} name={user_name} type={type} first_name={first_name} last_name={last_name} roomId={roomId} userID={userID} loader={this.state.loader} />
    );
  }
}