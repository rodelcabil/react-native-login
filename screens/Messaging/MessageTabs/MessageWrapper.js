import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import ChatClientClass from '../ChatClientClass'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { te } from 'date-fns/locale';

const MessageWrapper = ({ name, myID, clientID }) => {
  const [groupMessage, setGroupMessage] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [tempArr, setTempArr] = useState([])

  const route = useRoute();
  const user_name = route.params.user_name;
  const first_name = route.params.first_name;
  const last_name = route.params.last_name;
  const type = route.params.type;
  const roomId = route.params.roomId;
  const groupId = route.params.roomId;

  console.log("PASSED NAME: ", user_name)
  console.log("PASSED TYPE: ", type)
  console.log("PASSED ROOM ID: ", roomId)
  console.log(myID)

  useEffect(() => {
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

    const getUserList = async () => {

      const token = await AsyncStorage.getItem('token');
      const tokenget = token === null ? route.params.token : token;

      await axios.get(
        `https://beta.centaurmd.com/api/users/${clientID}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + tokenget
          },
        }).then(response => {

          setAllUsers(response.data)
          const mappedData = response.data.map((user) => {
            const userID = user.id;
            const tempArr = [];
      
            groupMessage.map((item) => {
              
             
              tempArr.push({
                ...item,
                first_name: user.first_name, 
                last_name: user.last_name
              })
             
            })
      
            return tempArr
          })
      
          console.log("MAPPED [0]: ",mappedData[0])
          setTempArr(mappedData[0])
        })


    }

    

    getGroupMessages();
    getUserList();



  }, [])

  return (
    <ChatClientClass name={name} route={route} clientID={clientID} chatMateName={user_name} type={type} first_name={first_name} last_name={last_name} roomId={roomId} myID={myID} groupName={user_name} groupMessage={groupMessage} />
  )
}

export default MessageWrapper