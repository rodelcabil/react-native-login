import { useRoute } from '@react-navigation/native';
import React from 'react'
import ChatClientClass from '../ChatClientClass'

const MessageWrapper = ({ name }) => {

const route = useRoute();
const user_name = route.params.user_name;

console.log("PASSED NAME: ",user_name)

  return (
    <ChatClientClass name={name} chatMateName={user_name}/>
  )
}

export default MessageWrapper