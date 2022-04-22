/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight,Image, Button} from 'react-native';
import {Card, Avatar} from 'react-native-paper';
import { Agenda } from 'react-native-calendars';
import AppBar from '../../ReusableComponents/AppBar';
import {showNotification, handleScheduleNotification, handleCancel} from '../../ReusableComponents/notification.android' 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import axios from 'axios';


const Calendar = ({ navigation }) => {

    const [items, setItems] = useState({
        '2022-03-20': [{ event: 'Schedule title 1', tag: {name:['Dr. Al', 'Dr. Jay Ar']}, schedule: '12nn - 1pm', type: 'consults' }],
        '2022-04-20': [{ event: 'Schedule Title 2', tag: {name:['Dr. Jim',  'Dr. Rodel']}, schedule: '12nn - 1pm', type: 'procedures' }, { event: 'Schedule Title 2', tag: {name:['Dr. Jim',  'Dr. Rodel']}, schedule: '12nn - 1pm', type: 'other' }], 
        '2022-04-21': [{ event: 'Schedule Title 3', tag: {name:['Dr. Al',  'Dr. Jim']}, schedule: '12nn - 1pm', type: 'reminder' }],
        '2022-04-22': [{ event: 'Schedule Title 4', tag: {name:['Dr. Rodel', 'Dr. Jay Ar']}, schedule: '12nn - 1pm', type: 'consults' }],
        '2022-04-23': [{ event: 'Schedule Title 5', tag: {name:['Dr. Jay Ar', 'Dr. Jim']}, schedule: '12nn - 1pm', type: 'other' }],
    });

    useEffect(()=>{
        const getData = async () =>{
            await fetch('https://beta.centaurmd.com/api/schedules', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(res => res.json())
                .then(resData => {
                console.log("sched: ",resData);
            });
        }

        console.log('ITEMS: ', items[0]?.type)

        getData()
    },[]);

    
    const [dayGet, setDay] = useState(null);

   
    
      const renderItems = (item) => {
        return (
          <TouchableHighlight 
            style={{ margin: 10}} 
            activeOpacity={0.6} 
            underlayColor="#DDDDDD"
            onPress={() => { navigation.navigate('View Schedule', {
              item: item,
            });} }
            >
            <Card style={{ backgroundColor: item.type === 'consults' ? '#da7331' : item.type === 'procedures' ? '#ffc000' :  item.type === 'reminder' ? '#3a87ad' :  '#81c784'}}>
              <Card.Content>
                <View style={styles.columnContainer}>
                  <Text style={styles.titleStyle}>{item.event}</Text>
                  <View style={styles.rowContainer}>
                    <Icon name="doctor" size={20} color="white" style={{ marginRight: 5 }} />
                    <Text style={styles.tagStyle}>{item.tag.name}&nbsp;</Text>
                  </View>
                  <View style={styles.rowContainer}>
                    <Icon name="calendar" size={20} color="white" style={{ marginRight: 5 }} />
                    <Text style={styles.scheduleStyle}>{item.schedule}</Text>
                </View>
                </View> 
              </Card.Content>
            </Card>
          </TouchableHighlight>
        );
      };

    
    const renderEmptyDate = () => {
        return (
        <View style={styles.itemEmptyContainer}>
              <Image
                style={styles.logoImg}
                source={require('../../../assets/calendar.png')}
              />
            <Text style={styles.text1}>You have no schedule at the moment for this day</Text>
            <Button
                  title="Add Schedule"
                  color="#28A745"
                  onPress={() => {navigation.navigate('Add Schedule', { getdate: dayGet});} }
            />
        </View>
        );
    }


    function toTimestamp(strDate){
        var datum = Date.parse(strDate);
        return datum;
    }

    const checkSched = (item) => {
        var dateString = toTimestamp(item.date);
        console.log(dateString);
        if(dateString === item.date){
            handleScheduleNotification("Hi!", "WELCOME", item.date)
        }
    }

    return (
        <View style={styles.container}>
            <AppBar title={"My Schedule"} showMenuIcon={false}/>
            <View style={styles.typesContainer}>
                <View style={styles.types}>
                    <View style={styles.circleOrange}></View>
                    <Text style={styles.text2}>CONSULTS</Text>
                </View>
                <View style={styles.types}>
                    <View style={styles.circleGY}></View>
                    <Text style={styles.text2}>PROCEDURES</Text>
                </View>
                <View style={styles.types}>
                    <View style={styles.circleBlue}></View>
                    <Text style={styles.text2}>REMINDER</Text>
                </View>
                <View style={styles.types}>
                    <View style={styles.circleLG}></View>
                    <Text style={styles.text2}>OTHER</Text>
                </View>
            </View>
            {/*
                <Button
                  title="Push Notification"
                  color="#28A745"
                  accessibilityLabel="Learn more about this purple button"
                  onPress={() => showNotification(items.title, items.agenda)}
                />
            */}
            <Agenda
               
                items={items}
                renderItem={renderItems}
                renderEmptyData={renderEmptyDate}
                onDayPress={day => {
                    console.log('day pressed', day);
                    setDay(day.dateString);
                    console.log(dayGet);
                }}
                selected={Date.now()}
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
        fontFamily: "Roboto",
        
       
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
        fontSize: 18,
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
        
    },
    itemEmptyContainer:{
        padding: 20,
        borderRadius: 5,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text1:{
        marginTop: 15,
        marginBottom: 15,
        fontSize: 15,
    },
    text2:{
        fontSize: 12,
    },
    logoImg: {
        width: 100,
        height: 100,
        opacity: 0.5,
        resizeMode: 'contain',
    },
    circleOrange: {
        marginLeft: 10,
        marginRight: 10,
        height: 20,
        width: 20,
        borderRadius: 15,
        backgroundColor: "#da7331",
    },
    circleGY: {
        marginLeft: 10,
        marginRight: 10,
        height: 20,
        width: 20,
        borderRadius: 15,
        backgroundColor: "#ffc000",
    },
    circleBlue: {
        marginLeft: 10,
        marginRight: 10,
        height: 20,
        width: 20,
        borderRadius: 15,
        backgroundColor: "#3a87ad",
    },
    circleLG: {
        marginLeft: 10,
        marginRight: 10,
        height: 20,
        width: 20,
        borderRadius: 15,
        backgroundColor: "#81c784",
    },
    types: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',

    },
    typesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        width: wp('20.5%'),

    }  
});

export default Calendar;