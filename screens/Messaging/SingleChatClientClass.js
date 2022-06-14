import React from 'react';
import Pusher from 'pusher-js/react-native';
import pusherConfig from '../../pusher.json';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import uuid from 'react-native-uuid';
import { update } from 'lodash';
import SingleChatView from './SingleChatView';


export default class SingleChatClientClass extends React.Component {

  constructor(props) {


    super(props);
    this.state = {
      messages: [],
      message1: [],
      message2: [],
      loader: true,
      name: '',
      myID: `${this.props.myID}`,
      receiverID: `${this.props.receiverID}`,
      clientID: `${this.props.clientID}`,
      roomId: `${this.props.roomId}`,
    };


    this.pusher = new Pusher(pusherConfig.key, pusherConfig);

    this.chatChannel = this.pusher.subscribe(this.state.roomId);
    this.chatChannel.bind('pusher:subscription_succeeded', () => {
      this.chatChannel.bind('chat', function (data) {
        console.log(data)
      });

      this.chatChannel.bind('single_message', (data) => {
        this.handleMessage(data.id, data.message, data.sender_id, data.receiver_id, data.roomId, data.created_at, data.updated_at, data.first_name, data.last_name, data.channelName,);
      });
    });

    this.handleSendMessage = this.onSendMessage.bind(this);

  }

  async handleMessage(id, message, sender_id, receiver_id, roomId, created_at, updated_at, first_name, last_name) {
    const messages = this.state.messages.slice();
    messages.push({
      created_at: created_at,
      first_name: first_name,
      roomId: roomId,
      id: id,
      last_name: last_name,
      message: message,
      sender_id: sender_id,
      receiver_id: receiver_id,
      updated_at: updated_at,
    });

    this.setState({
      messages: messages,
    });

  }

  getMessages = async () => {
    let arr;
    let arr2;

    const token = await AsyncStorage.getItem('token');
    const tokenget = token === null ? route.params.token : token;

    await axios.get(
        `https://beta.centaurmd.com/api/chat/user?sender_id=${37}&receiver_id=${38}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + tokenget
            },
        }).then(response => {

            arr = response.data.messages.map(data => {
                return {
                    ...data
                }
            })
            // this.setState({
            //   message1: response.data.messages
            // })

        })

    await axios.get(
        `https://beta.centaurmd.com/api/chat/user?sender_id=${38}&receiver_id=${37}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + tokenget
            },
        }).then(response2 => {

            arr2 = response2.data.messages.map(data => {
                return {
                    ...data
                }
            })

            // this.setState({
            //   message2: response2.data.messages
            // })
        })

    console.log("ARR 1", arr, 'ARR 2', arr2)

    let combinedMessage = arr.concat(arr2)


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


          combinedMessage.map((item) => {
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


        this.setState({
          messages: sort,
          loader: false,
          name: this.props.name
        })

      })
}



  componentDidMount = async () => {

    // this.getMessages();

    let arr;
    let arr2;

    const token = await AsyncStorage.getItem('token');
    const tokenget = token === null ? route.params.token : token;
    const value = await AsyncStorage.getItem('userDetails')
    const data = JSON.parse(value)

    console.log("CLIENT ID", data.client_id)
  
  

    await axios.get(
      `https://beta.centaurmd.com/api/chat/user?sender_id=${this.props.myID}&receiver_id=${this.props.receiverID}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + tokenget
        },
      }).then(response => {

        arr = response.data.messages.map(data => {
          return {
            ...data
          }
        })
      
      })

    await axios.get(
      `https://beta.centaurmd.com/api/chat/user?sender_id=${this.props.receiverID}&receiver_id=${this.props.myID}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + tokenget
        },
      }).then(response2 => {

        arr2 = response2.data.messages.map(data => {
          return {
            ...data
          }
        })

      })

   

    let combinedMessage = arr.concat(arr2)

    this.setState({
      message: combinedMessage
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


          combinedMessage.map((item) => {
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
        console.log("SORTED ", sort)
        this.setState({
          messages: sort,
          loader: false,
          name: this.state.name
        })

      })



    fetch(`${pusherConfig.restServer}/users/${this.state.name}`, {
      method: 'PUT'
    });
  }



  // async componentWillUnmount() { // (8)



  //   const token = await AsyncStorage.getItem('token');
  //   const tokenget = token === null ? route.params.token : token;
  //   await axios.get(
  //     `https://beta.centaurmd.com/api/chat/user?sender_id=${this.props.myID}&receiver_id=${this.props.receiverID}`,
  //     {
  //       headers: {
  //         'Accept': 'application/json',
  //         'Authorization': 'Bearer ' + tokenget
  //       },
  //     }).then(response => {
  //       this.setState({
  //         message1: response.data.messages
  //       })

  //     })
  //   await axios.get(
  //     `https://beta.centaurmd.com/api/chat/user?sender_id=${this.props.receiverID}&receiver_id=${this.props.myID}`,
  //     {
  //       headers: {
  //         'Accept': 'application/json',
  //         'Authorization': 'Bearer ' + tokenget
  //       },
  //     }).then(response2 => {

  //       // arr2 = response2.data.messages.map(data => {
  //       //   return {
  //       //     ...data
  //       //   }
  //       // })

  //       this.setState({
  //         message2: response2.data.messages
  //       })
  //     })

  //   console.log("ARR 1", this.state.message2, 'ARR 2', this.state.message1)

  //   let combinedMessage = this.state.message1.concat(this.state.message2)

  //   this.setState({
  //     messages: combinedMessage
  //   })

  //   await axios.get(
  //     `https://beta.centaurmd.com/api/users/${this.props.clientID}`,
  //     {
  //       headers: {
  //         'Accept': 'application/json',
  //         'Authorization': 'Bearer ' + tokenget
  //       },
  //     }).then(response => {


  //       const tempArr = [];

  //       response.data.map((user) => {
  //         const userID = user.id;


  //         this.state.messages.map((item) => {
  //           const senderID = item.sender_id;

  //           if (senderID === userID) {
  //             tempArr.push({
  //               ...item,
  //               first_name: user.first_name,
  //               last_name: user.last_name
  //             })
  //           }

  //         })

  //         return tempArr
  //       })


  //       let sort = tempArr.sort(function (a, b) {
  //         return (a.created_at > b.created_at) - (a.created_at < b.created_at);
  //       });

  //       this.setState({
  //         messages: sort,
  //         loader: false,
  //         name: this.state.name
  //       })

  //     })
  //   fetch(`${pusherConfig.restServer}/users/${this.state.name}`, {
  //     method: 'DELETE'
  //   });
  // }


  async onSendMessage(id, message, sender_id, receiver_id, created_at, updated_at, roomId, first_name, last_name) { // (9)

    console.log("called onSendMessage");
    const payload = {
      id: id,
      group_id: roomId,
      sender_id: sender_id,
      receiver_id: receiver_id,
      message: message,
      created_at: created_at,
      updated_at: updated_at,
      first_name: first_name,
      last_name: last_name,
      channelName: this.state.roomId
    };
    try {
      fetch(`${pusherConfig.restServer}/users/${this.props.name}/singleMessages`, {
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
    console.log("Message: ", message, "Message ID: ", id, "Sender ID: ", sender_id, "Receiver ID: ", receiver_id, 'Created at: ', created_at, 'Updated at: ', updated_at, 'Group ID: ', roomId, 'First Name: ', first_name, 'Last Name: ', last_name);
  }



  render() {
    // const messages = this.props.groupMessage;
    const user_name = this.props.chatMateName;
    const type = this.props.type;
    const first_name = this.props.first_name;
    const last_name = this.props.last_name;
    const roomId = this.props.roomId;
    const userID = this.props.myID;
    const receiverID = this.props.receiverID;
    const clientID = this.props.clientID;

    // console.log("MESSAGESSS: ", this.state.messages)

    //this.state.roomId = roomId;

    return (
      <SingleChatView message={this.state.messages} onSendMessage={this.handleSendMessage} name={user_name} type={type} first_name={first_name} last_name={last_name} roomId={roomId} userID={userID} receiverID={receiverID} loader={this.state.loader} clientID={clientID} />
    );
  }
}