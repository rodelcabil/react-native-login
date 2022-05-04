import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native'
import AppBar from './ReusableComponents/AppBar'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

const Account = ({route}) => {
    // const { details } = route.params;

    // console.log('DETAILS: ', details)

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Admin', value: 'admin' },
        { label: 'Doctor', value: 'doctor' },
        { label: 'Staff', value: 'staff' }
    ]);

    useEffect(()=>{
        try {
            const value =  AsyncStorage.getItem('userDetails');
            if (value !== null) {
                // We have data!!
                console.log(JSON.parse(value));
            }
        } catch (error) {
              console.log("Error: ", error);
        }
    })
  

    return (
        <View style={styles.container}>
            <AppBar title="My Account" showMenuIcon={true} />
            <ScrollView>
                <View style={{padding: 10}}>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputTitle}>Access</Text>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}

                        />

                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputTitle}>Display Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Enter your Display Name"
                                keyboardType="email-address"
                                style={styles.input}
                            // value={email}
                            />
                        </View>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputTitle}>First Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Enter your First Name"
                                keyboardType="email-address"
                                style={styles.input}
                            // value={email}
                            />
                        </View>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputTitle}>Last Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Enter your Last Name"
                                keyboardType="email-address"
                                style={styles.input}
                            // value={email}
                            />
                        </View>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputTitle}>Username</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Enter your Username"
                                keyboardType="email-address"
                                style={styles.input}
                            // value={email}
                            />
                        </View>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputTitle}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Enter your Email Address"
                                keyboardType="email-address"
                                style={styles.input}
                            // value={email}
                            />
                        </View>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputTitle}>Password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Enter your Password"
                                keyboardType="email-address"
                                style={styles.input}
                            // value={email}
                            />
                        </View>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputTitle}>Confirm Password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Confirm your Password"
                                keyboardType="email-address"
                                style={styles.input}
                            // value={email}
                            />
                        </View>
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

    },
    inputContainer: {
        flexDirection: 'column',
        height: 50,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 18,

    },
    inputTitle: {
        marginBottom: 5
    },
    inputWrapper: {
        padding: 10
    },
    input: {
        fontSize: 16
    }
})

export default Account