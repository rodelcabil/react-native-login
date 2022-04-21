import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TextInput, Button} from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import {Card, Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';

const AddSchedule = ({route}) =>{
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Consults', value: 'consults'},
        {label: 'Procedures', value: 'procedures'},
        {label: 'Reminder', value: 'reminder'},
        {label: 'Other', value: 'other'},
    ]);


    const [title, setTitle] = useState(null);
    const [member, setMember] = useState(null);

    return(
        <View style={styles.container}>
             <AppBar title={"Add Schedule"} showMenuIcon={false}/>
             <SafeAreaView style={styles.safeAreaViewContainer}>
             <Text style={styles.textTitle}>Add Schedule for Date - {route.params.getdate}</Text>
             <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                textStyle={{
                    fontSize: 15,
                }}
                style={{ borderColor: value === 'consults' ? '#da7331' : value === 'procedures' ? '#ffc000' :  value === 'reminder' ? '#3a87ad' : value === 'other' ? '#81c784' :  '#fff', 
                    borderWidth: 2}}
             />

            <Text style={styles.text}>Schedule Name</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    keyboardType="email-address"
                    onChangeText={titleInp => setTitle(titleInp)}
                />
            </View>

            <Text style={styles.text}>Person Involved</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    keyboardType="email-address"
                    onChangeText={inv => setMember(inv)}
                />
            </View>

            <View style={styles.buttonCont}>
            <Button
                  title="Add"
                  color="#28A745"

            />
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
    inputContainer: {
        marginHorizontal: 3,
        flexDirection: 'row',
        height: 55,
        marginVertical: 2,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 15,
        alignItems: 'center',
        fontSize: 18,
        backgroundColor: 'white',
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
    text:{
        marginHorizontal: 3,
        fontSize: 15,
        fontWeight: '400',
        marginTop: 15,
    },
    textTitle:{
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 10,
        padding: 5,
    },
    buttonCont:{
        marginHorizontal: 5,
        marginTop: 30,
    }
});

export default AddSchedule;