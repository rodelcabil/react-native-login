import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { te } from 'date-fns/locale';
import SingleChatClientClass from '../SingleChatClientClass';

const SingleMessageWrapper = () => {
    const [roomId, setRoomId] = useState();
    const [clientID, setClientID] = useState();
    const [userDetails, setUserDetails] = useState([]);
    const [message1, setMessage1] = useState([])
    const [allMessages, setAllMessages] = useState([])

    const route = useRoute();
    const user_name = route.params.user_name;
    const first_name = route.params.first_name;
    const last_name = route.params.last_name;
    const type = route.params.type;
    const myMame = userDetails?.first_name + " " + userDetails?.last_name;
  
    const myID = userDetails?.id;
    const receiverID = route.params.id;

    let combinedMessage;





    useEffect(() => {

        const getUserDetails = async () => {
            const value = await AsyncStorage.getItem('userDetails')
            const data = JSON.parse(value)
            setUserDetails(data);
            setClientID(data?.client_id)
            let room = [receiverID, data.id];
            room.sort(function (a, b) {
                return a - b;
            });
            const convertedRoom = room.toString().replace(/,/g, '')
            console.log("CHAT ROOM: ", convertedRoom)
            setRoomId(convertedRoom)


        }

        const getCombinedMessages = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            let arr;

            await axios.get(
                `https://beta.centaurmd.com/api/chat/user?sender_id=${myID}&receiver_id=${receiverID}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {
                    arr = response.data.messages.map(data =>{
                        return {...data}
                    })
                })

            await axios.get(
                `https://beta.centaurmd.com/api/chat/user?sender_id=${receiverID}&receiver_id=${myID}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response2 => {


                     combinedMessage = arr.concat(response2.data.messages)

                    setAllMessages(combinedMessage)

                    console.log('COMBINED: ', combinedMessage)
                })
        }




        getUserDetails();
        // getCombinedMessages()

    }, [receiverID, myID])

    return (
        <SingleChatClientClass name={myMame} route={route}  receiverID={receiverID} myID={myID} clientID={clientID} chatMateName={user_name} type={type} first_name={first_name} last_name={last_name} roomId={roomId} groupName={user_name} allMessages={combinedMessage} />
    )
}

export default SingleMessageWrapper