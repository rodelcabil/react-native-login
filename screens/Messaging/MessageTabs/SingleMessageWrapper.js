import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { te } from 'date-fns/locale';
import SingleChatClientClass from '../SingleChatClientClass';

const SingleMessageWrapper = () => {
    const [roomId, setRoomId] = useState();
    const [userDetails, setUserDetails] = useState([]);


    const route = useRoute();
    const user_name = route.params.user_name;
    const first_name = route.params.first_name;
    const last_name = route.params.last_name;
    const type = route.params.type;
    const myMame = userDetails?.first_name + " " + userDetails?.last_name;
    const clientID = userDetails?.client_id;
    const myID = userDetails?.id;
    const receiverID = route.params.id;

    console.log('RECEIVER ID: ', receiverID)

    


    useEffect(() => {

        const getUserDetails = async () => {
            const value = await AsyncStorage.getItem('userDetails')
            const data = JSON.parse(value)
            setUserDetails(data);

            let room = [receiverID, data.id];
            room.sort(function (a, b) {
                return a - b;
            });
            const convertedRoom = room.toString().replace(/,/g, '')
            console.log("CHAT ROOM: ", convertedRoom)
            setRoomId(convertedRoom)

            
        }

     


        getUserDetails();
       
    }, [])

    return (
        <SingleChatClientClass name={myMame} route={route} clientID={clientID} chatMateName={user_name} type={type} first_name={first_name} last_name={last_name} roomId={roomId} receiverID={receiverID} myID={myID} groupName={user_name} />
    )
}

export default SingleMessageWrapper