import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView, Dimensions, TouchableHighlight, Image } from 'react-native'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Searchbar } from 'react-native-paper';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin'
import RNRestart from 'react-native-restart';
import AppBar from '../ReusableComponents/AppBar'

import moment from 'moment';
import { sr } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Colleagues from './MessageTabs/colleagues';
import GroupChat from './MessageTabs/groupChat';
import AllChat from './MessageTabs/allChats';
import MainChatPageAppBar from '../ReusableComponents/MainChatPageAppBar';



const ChatList = ({ navigation, route, clientID, userID }) => {
    const isFocused = useIsFocused();
    
   
    const [groupList, setGroupList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [allChat, setAllChat] = useState([]);

    const [allChatLoader, setAllChatLoader] = useState(true);
    const [groupChatLoader, setGroupChatLoader] = useState(true);
    const [colleagueLoader, setColleagueLoader] = useState(true);


    let mappedData1;
    let mappedData2;


    useEffect(() => {
        const getGroupList = async () => {

            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/chat/client-group`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {
                    let sort = response.data.sort(function (a, b) {
                        return new Date(b.updated_at).getTime() < new Date(a.updated_at).getTime() ? 1 : -1;
                    });

                    setGroupList(sort)
                    setGroupChatLoader(false);
                    // console.log("GROUP LIST: ", sort)

                })

            // console.log("DASHBOARD - SCHEDULES: ", schedule)
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

                    const newList = response.data.filter(item => { return item.id !== userID });

                    let sort = newList.sort(function (a, b) {
                        return new Date(b.updated_at).getTime() < new Date(a.updated_at).getTime() ? 1 : -1;
                    });
                    // console.log("USER DETAILS: ", sort)
                    setUserList(sort)
                    setColleagueLoader(false);
                    // console.log("ROUTESSS: ", route.params.token);

                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)

        }
        const getCombinedList = async () => {

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

                    const newList = response.data.map((data) => {
                        return {
                            ...data, type: 'user'
                        }
                    })

                    mappedData1 = newList.filter(item => { return item.id !== userID });

                    // console.log("ALL CHAT - USER LIST: ", mappedData1)
                })

            await axios.get(
                `https://beta.centaurmd.com/api/chat/client-group`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                    mappedData2 = response.data.map((data) => {
                        return {
                            ...data, type: 'group'
                        }
                    })
                    // console.log("ALL CHAT - GROUP LIST: ", mappedData2)
                    const combined = mappedData1.concat(mappedData2)

                    let sort = combined.sort(function (a, b) {
                        return new Date(b.updated_at).getTime() < new Date(a.updated_at).getTime() ? 1 : -1;
                    });

                    setAllChat(sort)
                    // console.log("COMBINED: ALL CHAT", sort)

                    setAllChatLoader(false)
                })

        }

        const tryCombineAPI = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/chat/client-group`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {
                    let tempArr = [];
                    response.data.map((data, key) => {
                        const id = data.id
                        const name = data.name
                       
                        const Api2 = async () => {
                            await axios.get(
                                `https://beta.centaurmd.com/api/chat/client-group-user?group_id=${id}`,
                                {
                                    headers: {
                                        'Accept': 'application/json',
                                        'Authorization': 'Bearer ' + tokenget
                                    },
                                }).then(response2 => {
                                    response2.data.forEach(element => {
                                        if (element.user_id === userID) {
                                            tempArr.push({
                                                id: id,
                                                name: name,
                                                userid: element.user_id,
                                                type: 'group'
                                            })
                                            console.log("TEMP ARRAY: ",tempArr)
                                        }
                                        setGroupChatLoader(false)
                                    });
                                    setGroupList(tempArr)
                                   
                                })

                        }
                        Api2()

                    });
                  
                })

        }


    
        getUserList();
        getGroupList();
        getCombinedList();
        // tryCombineAPI();

    }, [isFocused]);


    // const navigation = useNavigation(); 
    

    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = query => setSearchQuery(query);

    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'All' },
        { key: 'second', title: 'Group' },
        { key: 'third', title: 'Colleague' },
    ]);

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#3a87ad' }}
            style={{ backgroundColor: '#fff', }}
            renderLabel={({ route }) => (
                <Text style={{ color: 'black', margin: 8, textTransform: 'uppercase', fontSize: 12 }}>
                    {route.title}
                </Text>
            )}
        />
    );

    const renderScene = SceneMap({
        first: () => <AllChat navigation={navigation} filterData={searchQuery} loader={allChatLoader} allChat={allChat} />,
        second: () => <GroupChat navigation={navigation} filterData={searchQuery} loader={groupChatLoader} groupList={groupList} userID={userID} />,
        third: () => <Colleagues navigation={navigation} filterData={searchQuery} loader={colleagueLoader} userList={userList} />
    });


    return (
        <View style={styles.container}>
            <MainChatPageAppBar searchQuery={searchQuery} onChangeSearch={onChangeSearch}/>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar}
            />


        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    body: {
        flex: 1,
        padding: 10,
        // backgroundColor: 'orange'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 10
    },
    columnContainer: {
        justifyContent: 'center'
    },
    name: {
        fontSize: 15,
        width: 250,
        color: 'black'
    },
    message: {
        fontSize: 13,
        maxWidth: 250,
    },
    date: {
        fontSize: 11,
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    textLogOut: {
        fontSize: 15,
        color: 'red',
    },
    textEmail: {
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 15,
        color: 'white',
    },
    containerMenu: {
        width: 200,
    },
    containerMenuItem: {
        backgroundColor: '#075DA7',
        height: 150,
        resizeMode: 'contain',
        alignItems: 'center',
        padding: 20,
    },
    profileImageItem: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatar: {
        backgroundColor: '#3a87ad'
    }
});
export default ChatList