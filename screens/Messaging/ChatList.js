import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView, Dimensions, TouchableHighlight, Image } from 'react-native'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Searchbar } from 'react-native-paper';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin'
import RNRestart from 'react-native-restart';
import AppBar from '../ReusableComponents/AppBar'
import LoaderSmall from '../ReusableComponents/LottieLoader-Small';
import moment from 'moment';
import { hi, sr } from 'date-fns/locale';
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
    const [chatMateList, setChatMateList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [allChat, setAllChat] = useState([]);
    const [lastGroupMessage, setLasGroupMessage] = useState([])

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
                `https://beta.centaurmd.com/api/chat/user-group?user_id=${userID}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                    let sort = response.data.map(data => {
                        return {
                            ...data
                        }
                    }).sort(function (a, b) {
                        return new Date(b.updated_at).getTime() < new Date(a.updated_at).getTime() ? 1 : -1;
                    })

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
                    setUserList(response.data)
                })
        }

        const getChatMateList = async () => {

            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/chat/messages`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                    // const newList = response.data.filter(item => { return item.id !== userID });

                    let sort = response.data.chat_history.sort(function (a, b) {
                        return new Date(b.created_at).getTime() < new Date(a.created_at).getTime() ? 1 : -1;
                    });
                    // console.log("USER DETAILS: ", sort)
                    setChatMateList(sort)
                    setColleagueLoader(false);
                    // console.log("ROUTESSS: ", route.params.token);

                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)

        }

        const getCombinedList = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;



            await axios.get(

                `https://beta.centaurmd.com/api/chat/messages`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                    const newList = response.data.chat_history.map((data) => {
                        return {
                            ...data,
                            type: 'user'
                        }
                    })

                    mappedData1 = newList.filter(item => { return item.id !== userID });


                })


            await axios.get(
                `https://beta.centaurmd.com/api/chat/user-group?user_id=${userID}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {
                    let arr = [];

                    mappedData2 = response.data.map((data, index) => {
                        return {
                            ...data,
                            type: 'group'
                        }
                    })

                    setLasGroupMessage(arr)
                    const combined = mappedData1.concat(mappedData2)

                    let sort = combined.sort(function (a, b) {
                        return new Date(b.updated_at).getTime() < new Date(a.updated_at).getTime() ? 1 : -1;
                    });

                    setAllChat(sort)
                    // console.log("COMBINED: ALL CHAT", sort)
                    // console.log("ARR",arr);

                    setAllChatLoader(false)
                })

        }
        getChatMateList();
        getUserList();
        getGroupList();
        getCombinedList();

        const unsubscribe = navigation.addListener('focus', () => {
            getChatMateList();
            getUserList();
            getGroupList();
            getCombinedList();
        });

        return unsubscribe


    }, [navigation]);


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
        first: () => <AllChat navigation={navigation} filterData={searchQuery} loader={allChatLoader} allChat={allChat} userList={userList} myID={userID} />,
        second: () => <GroupChat navigation={navigation} filterData={searchQuery} loader={groupChatLoader} groupList={groupList} myID={userID} userList={userList} />,
        third: () => <Colleagues navigation={navigation} filterData={searchQuery} loader={colleagueLoader} userList={chatMateList} userID={userID} clientID={clientID} />
    });


    return (
        <View style={styles.container}>
            <MainChatPageAppBar searchQuery={searchQuery} onChangeSearch={onChangeSearch} />
            {allChatLoader === true ? <View style={{ height: '100%', justifyContent: 'center' }}><LoaderSmall /></View> :
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
                />
            }

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