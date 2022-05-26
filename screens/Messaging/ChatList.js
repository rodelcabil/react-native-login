import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView, Dimensions, TouchableHighlight,Image  } from 'react-native'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Searchbar } from 'react-native-paper';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin'
import RNRestart from 'react-native-restart'; 
import AppBar from '../ReusableComponents/AppBar'
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import { sr } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import Colleagues from './MessageTabs/colleagues';
import GroupChat from './MessageTabs/groupChat';
import AllChat from './MessageTabs/allChats';


const ChatList = ({ navigation, route, clientID, userID }) => {
    const [searchBG, setSearchBG] = useState('#fff');
    const [visible, setVisible] = useState(false);
    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);


    const [groupList, setGroupList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [allChat, setAllChat] = useState([]);
    const [loader, setLoader] = useState(false);
    let mappedData1;
    let mappedData2;
  
  
    useEffect(() => {
        const getGroupList = async () => {
            setLoader(true);
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

                    setGroupList(response.data)

                    console.log("GROUP LIST: ", response.data)
                   
                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
        }
        const getUserList = async () => {
            setLoader(true);
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
                    setUserList(newList)
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

                     mappedData1 = response.data.map((data) => {
                        return {
                            ...data, type: 'user'
                        }
                    })

                    console.log("ALL CHAT - USER LIST: ", mappedData1)
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
                    console.log("ALL CHAT - GROUP LIST: ", mappedData2)
                    const combined = mappedData1.concat(mappedData2)

                    setAllChat(combined)
                    console.log("COMBINED: ALL CHAT", combined)
                   

                })
                setLoader(false)
        }
      
        
        getUserList();
        getGroupList();
        getCombinedList();
       
    }, []);


   // const navigation = useNavigation(); 
    const signOut = async () => {
        try{
          await AsyncStorage.removeItem('token')
          await AsyncStorage.removeItem('userDetails');
          const isSignedIn = await GoogleSignin.isSignedIn();
          if(!isSignedIn){
            RNRestart.Restart();
          }
          else{
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            RNRestart.Restart();
          }
        }
        catch(error){
          console.log('Error', error);
        }
      }

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
        first: () => <AllChat navigation={navigation} filterData={searchQuery} loader={loader} allChat={allChat}/>,
        second: () => <GroupChat navigation={navigation} filterData={searchQuery} loader={loader} groupList={groupList}/>,
        third: () => <Colleagues navigation={navigation} filterData={searchQuery} loader={loader} userList={userList}/>
    });


    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.headerWrapper}> 
                <Searchbar
                    style={{width: Dimensions.get('window').width-80,  shadowOpacity: 0, elevation: 0, backgroundColor: searchBG, color:"white", borderRadius: 100}}
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    inputStyle={{fontSize: 15}}
                    onFocus={()=>{
                        setSearchBG('#e3e3e3')
                    }}
                    onBlur={()=>{
                        setSearchBG('#fff')
                    }}
                    />
              
                <Menu
                    style={styles.containerMenu}
                    visible={visible}
                    anchor={
                    <TouchableHighlight onPress={showMenu}>
                        <Image
                            style={styles.profileImage}
                            source={{
                            uri: 'https://cdn-icons-png.flaticon.com/512/194/194915.png',
                            }}
                        />
                    </TouchableHighlight>
                    }
                    onRequestClose={hideMenu}
                >
                    <View style={styles.containerMenuItem}>
                        <Image
                            style={styles.profileImageItem}
                            source={{
                            uri: 'https://cdn-icons-png.flaticon.com/512/194/194915.png',
                            }}
                        />
                        <Text style={styles.textEmail}>Dr. Sample Name</Text>
                    </View>
                    <MenuItem onPress={hideMenu}>View Profile</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={signOut}><Text style={styles.textLogOut}>Log Out</Text></MenuItem>
                </Menu>
                </View>
            </SafeAreaView>

            
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
    headerWrapper:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
    },
    profileImage:{
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
    containerMenu:{
        width: 200,
    },
    containerMenuItem:{
        backgroundColor: '#075DA7',
        height: 150,
        resizeMode: 'contain',
        alignItems: 'center',
        padding: 20,
    },
    profileImageItem:{
        width: 80,
        height: 80,
        borderRadius: 40,
    },

});
export default ChatList