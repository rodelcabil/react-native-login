import { useRoute } from '@react-navigation/native';
import React from 'react'
import ChatClientClass from '../ChatClientClass'

const MessageWrapper = ({ name, myID }) => {

const route = useRoute();
const user_name = route.params.user_name;
const first_name =  route.params.first_name;
const last_name =  route.params.last_name;
const type = route.params.type;
const roomId =  route.params.roomId;

console.log("PASSED NAME: ",user_name)
console.log("PASSED TYPE: ",type)
console.log("PASSED ROOM ID: ",roomId)
console.log(myID)

  return (
    <ChatClientClass name={name} chatMateName={user_name} type={type} first_name={first_name} last_name={last_name} roomId={roomId} myID={myID}/>
  )
}

export default MessageWrapper