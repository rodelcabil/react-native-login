import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions  } from 'react-native'
import AppBar from '../ReusableComponents/AppBar'
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import { sr } from 'date-fns/locale';

import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import Colleagues from './MessageTabs/colleagues';
import GroupChat from './MessageTabs/groupChat';
import AllChat from './MessageTabs/allChats';


const ChatList = ({ navigation, route, clientID, userID }) => {


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
        first: () => <AllChat navigation={navigation} route={route} clientID={clientID} userID={userID}/>,
        second: () => <GroupChat navigation={navigation} route={route} clientID={clientID} userID={userID}/>,
        third: () => <Colleagues navigation={navigation} route={route} clientID={clientID} userID={userID}/>
    });


   

    return (
        <View style={styles.container}>

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

});
export default ChatList