/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import {Card, Avatar} from 'react-native-paper';
import { Agenda } from 'react-native-calendars';
import AppBar from './ReusableComponents/AppBar';
import {showNotification, handleScheduleNotification, handleCancel} from './ReusableComponents/notification.android' 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Home = () => {

    const [items, setItems] = useState({
        '2022-03-20': [{ event: 'Event title 1', tag: {name:['Dr. Al', ' Dr. Jay Ar']}, schedule: '12nn - 1pm', type: 'consults' }],
        '2022-04-20': [{ event: 'Event Title 1', tag: {name:['Dr. Jim',  ' Dr. Rodel']}, schedule: '12nn - 1pm', type: 'procedures' }],
        '2022-04-21': [{ event: 'Event Title 1', tag: {name:['Dr. Al',  ' Dr. Jim']}, schedule: '12nn - 1pm', type: 'reminder' }],
        '2022-04-22': [{ event: 'Event Title 2', tag: {name:['Dr. Rodel', ' Dr. Jay Ar']}, schedule: '12nn - 1pm', type: 'consults' }],
        '2022-04-23': [{ event: 'Event Title 2', tag: {name:['Dr. Jay Ar', ' Dr. Jim']}, schedule: '12nn - 1pm', type: 'other' }],
    });

    
      const renderItems = (item) => {
        return (
          <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
            <Card style={{ backgroundColor: item.type === 'consults' ? '#da7331' : item.type === 'procedures' ? '#ffc000' :  item.type === 'reminder' ? '#3a87ad' :  '#81c784'}}>
              <Card.Content>
                <View style={styles.columnContainer}>
                  <Text style={styles.titleStyle}>{item.event}</Text>
                  <View style={styles.rowContainer}>
                    <Icon name="doctor" size={20} color="white" style={{ marginRight: 5 }} />
                    {}  
                    <Text style={styles.tagStyle}>{item.tag.name}</Text>
                  </View>
                  <View style={styles.rowContainer}>
                    <Icon name="calendar" size={20} color="white" style={{ marginRight: 5 }} />
                    <Text style={styles.scheduleStyle}>{item.schedule}</Text>
                </View>
                </View> 
              </Card.Content>
            </Card>
          </TouchableOpacity>
        );
      };
    

    return (
        <View style={styles.container}>
            <AppBar/>
            <Button
                  title="Push Notification"
                  color="#28A745"
                  accessibilityLabel="Learn more about this purple button"
                  onPress={() => showNotification("Hi!", "WELCOME")}
                />
            <Agenda
                items={items}
                renderItem={renderItems}
                theme={{
                    selectedDayBackgroundColor: '#075DA7',
                }}
            />
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: "AppleSDGothicNeo-Regular",
       
    },
    itemContainer:{
        marginTop: 17,
        marginRight: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    cardContainer: {
       
    },
    columnContainer:{
        flexDirection: 'column',
       
    },
    rowContainer:{
        flexDirection: 'row',
        marginTop: 5,
       
    },
    titleStyle: {
        letterSpacing: 0.2,
        fontWeight: '800',
        color: '#fff',
        fontSize: 20,
    },
    tagStyle: {
        fontWeight: '700',
        fontSize: 14,
        color: '#fff',
        
    },
    scheduleStyle: {
        fontWeight: '700',
        fontSize: 14,
        color: '#fff',
        
    }
});

export default Home;