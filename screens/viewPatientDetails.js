import React, { useState, useEffect } from 'react'
import { View, StyleSheet, SafeAreaView, Text, Image, ScrollView, Button } from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FAIcon5 from 'react-native-vector-icons/FontAwesome5';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import moment from 'moment';

const ViewPatientDetails = ({ route }) => {

    const [patientDetails, setPatientDetails] = useState([]);

    useEffect(()=>{
        const getPatientDatails = async () => {
            const token = await AsyncStorage.getItem('token');
            console.log(token, "token");
            await fetch('https://beta.centaurmd.com/api/patient-details/'+ route.params.data, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(res => res.json())
                .then(resData => {
                    
                    setPatientDetails(resData);
                    
                });
        }

        getPatientDatails();
    }, []);


    return (
        <View style={styles.container}>
            <AppBar title={"Patient Details"} showMenuIcon={true} />
            <ScrollView>
                <View style={styles.body}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.textName}>{patientDetails.first_name} {patientDetails.last_name}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Icon name="email" size={20} color="#da7331"/>
                        <Text style={styles.textDetails}>{patientDetails.email_address}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <EntypoIcon name="phone" size={20} color="#da7331"/>
                        <Text style={styles.textDetails}>{patientDetails.contact_number}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <FAIcon5 name="birthday-cake" size={20} color="#da7331"/>
                        <Text style={styles.textDetails}>{moment(patientDetails.birthday).format('ll')}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Icon name="human-male-height" size={20} color="#da7331"/>
                        <Text style={styles.textDetails}>{patientDetails.height}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Icon name="weight" size={20} color="#da7331"/>
                        <Text style={styles.textDetails}>{patientDetails.weight}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                    <EntypoIcon name="location-pin" size={23} color="#da7331" />
                        <Text style={styles.textDetails}>{patientDetails.city}, {patientDetails.state}, {patientDetails.country}</Text>
                    </View>
                    
                    
                    <View style={styles.historyWrapper}>
                        <Text style={styles.textHistory}>History</Text>
                        {patientDetails.cases.map((data) => {
                           return <View style={styles.historyContainer}>
                                    <Text style={styles.caseTitle}>{data.notes}</Text>
                                    <Text style={styles.caseTitle}>{data.type}</Text>
                                  </View>
                        })}
                        
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: "Poppins",

    },
    body: {
        padding: 20,
        flexDirection: 'column'

    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
     
    },
    detailsContainer: {
        paddingTop: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
     
    },
    textName:{
        fontSize: 22,
        color: '#0E2138',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    circleBlue: {

        marginRight: 10,
        height: 10,
        width: 10,
        borderRadius: 15,
        backgroundColor: "#da7331",
    },
    textDetails:{
        marginLeft: 20,
        color: '#000',
        fontSize: 16,
        fontWeight: '3=400'
    },
    historyWrapper:{
        paddingTop: 20,
        flexDirection: 'column',
       
    },
    historyContainer:{
        backgroundColor: "#da7331",
        borderRadius: 5,
        padding: 10,
        flexDirection: 'column',
    },
    textHistory:{
        fontSize: 16,
        color: '#0E2138',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    caseTitle:{
        color: '#fff',
        fontSize: 16
    }
});

export default ViewPatientDetails