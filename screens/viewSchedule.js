import React from "react";
import { View, StyleSheet, SafeAreaView, Text} from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import {Card, Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ViewSchedule = ({route}) =>{
    return(
        <View style={styles.container}>
             <AppBar title={route.params.item?.event} showMenuIcon={true}/>
             <SafeAreaView style={styles.safeAreaViewContainer}>
                <View 
                 style={{
                    backgroundColor: route.params.item.type === 'consults' ? '#da7331' : route.params.item.type === 'procedures' ? '#ffc000' :  route.params.item.type === 'reminder' ? '#3a87ad' :  '#81c784',
                    borderRadius: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 10
                }}>
                    <View style={styles.columnContainer}>
                    <Text style={styles.titleStyle}>{route.params.item?.event}</Text>
                    <View style={styles.rowContainer}>
                        <Icon name="doctor" size={20} color="white" style={{ marginRight: 5 }} />
                        <Text style={styles.tagStyle}>{route.params.item?.tag?.name}&nbsp;</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Icon name="calendar" size={20} color="white" style={{ marginRight: 5 }} />
                        <Text style={styles.scheduleStyle}>{route.params.item?.schedule}</Text>
                    </View>
                    </View> 
                </View>
             </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: "Roboto",
       
    },
    itemContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderLeftColor: 'green',
        borderLeftWidth: 5,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    safeAreaViewContainer: {
        padding: 20,
        flex: 1,
        backgroundColor: '#F2F4F5'
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
        color: 'white',
        fontSize: 18,
    },
    tagStyle: {
        fontWeight: '700',
        fontSize: 14,
        color: 'white',
        
    },
    scheduleStyle: {
        fontWeight: '700',
        fontSize: 14,
        color: 'white',
        
    },
});

export default ViewSchedule;