
import React, {useEffect, useState} from 'react'
import { View, StyleSheet, Text, TextInput } from 'react-native'
import AppBar from './ReusableComponents/AppBar';
import { List, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {    Snackbar } from 'react-native-paper';
const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};

const APICalls = () => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState();
    const [items, setItems] = useState([
        { label: 'Live', value: 'centaurmd.com' },
        { label: 'Beta', value: 'beta.centaurmd.com' },
       
    ]);

    const [visible, setVisible] = useState(false);

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);


    const setBaseURL = async (url) => {
        await AsyncStorage.setItem('BASE_URL', url);
        
    };
        
    

    useEffect(()=>{
       
       
        const getBaseURL = async() =>{
            const url = await AsyncStorage.getItem('BASE_URL')
            if(url !== null){
                setValue(url)
                console.log("BASE URL: ", url)
            }
            
        }

      
        
        getBaseURL()
        console.log("VALUE: ", value)
       
    },[])

    return (
        <PaperProvider theme={black_theme}>
            <View style={styles.container}>
                <AppBar title="API Calls" showMenuIcon={true} />
                <View style={styles.wrapper}>

                    {/* <List.Accordion
                        title="Google Calendar"
                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', }}>
                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                            <View style={{  backgroundColor: '#fff',  borderRadius: 6, flexDirection: 'column', justifyContent: 'space-between' }}>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputTitle}>Email</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="Enter your Email"
                                            keyboardType="email-address"
                                            style={styles.input}
                                        // value={email}
                                        />
                                    </View>
                                </View>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputTitle}>App Password</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="Enter your App Password"
                                            keyboardType="email-address"
                                            style={styles.input}
                                        // value={email}
                                        />
                                    </View>
                                </View>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputTitle}>Token</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="Enter your Token"
                                            keyboardType="email-address"
                                            style={styles.input}
                                        // value={email}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </List.Accordion>
                    <View style={{ marginBottom: 5 }} /> */}
                    <List.Accordion
                        title="Centaurmd"
                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', }}>
                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputTitle}>URL</Text>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    onChangeValue={(value) => {
                                        console.log("ON CHANGE: ",value);
                                        setBaseURL(value === 'beta.centaurmd.com' ? value : 'beta.centaurmd.com')
                                        // setValue(value === 'beta.centaurmd.com' ? value : 'beta.centaurmd.com')
                                        onToggleSnackBar();
                                    }}
                                />

                            </View>
                        </View>
                    </List.Accordion>
                    <View style={{ marginBottom: 5 }} />
                   
                </View>
                <Snackbar
                        visible={visible}
                        onDismiss={onDismissSnackBar}
                        action={{
                        label: 'Close',
                        onPress: () => {
                            // Do something
                        },
                        }}>
                        {value === 'beta.centaurmd.com' ? 'URL value: ' +value : 'URL value: ' +value+' but it is not yet connected to live server'}
                    </Snackbar>
            </View>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    wrapper: {
        padding: 10
    },
    inputContainer: {
        flexDirection: 'column',
        height: 50,
        borderWidth: 1,
        borderColor: '#e3e3e3',
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

export default APICalls