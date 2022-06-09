import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import ChatClientClass from '../ChatClientClass'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { te } from 'date-fns/locale';

const MessageWrapper = () => {
  const [groupMessage, setGroupMessage] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  

  const route = useRoute();
  const user_name = route.params.user_name;
  const first_name = route.params.first_name;
  const last_name = route.params.last_name;
  const type = route.params.type;
  const roomId = route.params.roomId;
  const groupId = route.params.roomId;
  const myMame = userDetails?.first_name +" "+ userDetails?.last_name;
  const clientID = userDetails?.client_id;
  const myID = userDetails?.id;

  console.log("PASSED NAME: ", user_name)
  console.log("PASSED TYPE: ", type)
  console.log("PASSED ROOM ID: ", roomId)
  console.log(myID)
  console.log(myMame)

  useEffect(() => {

    const getUserDetails = async () => {
      const value = await AsyncStorage.getItem('userDetails')
      const data = JSON.parse(value)
     setUserDetails(data)
     console.log("MESSAGE WRAPPER: ", data)
  }

    const getGroupMessages = async () => {

      const token = await AsyncStorage.getItem('token');
      const tokenget = token === null ? route.params.token : token;

      await axios.get(
        `https://beta.centaurmd.com/api/chat/client-group-message?group_id=${groupId}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + tokenget
          },
        }).then(response => {
          

          setGroupMessage(response.data)

        })

    }

    
    getUserDetails();
    getGroupMessages();



  }, [])

  return (
    <ChatClientClass name={myMame} route={route} clientID={clientID} chatMateName={user_name} type={type} first_name={first_name} last_name={last_name} roomId={roomId} myID={myID} groupName={user_name} groupMessage={groupMessage} />
  )
}

export default MessageWrapper