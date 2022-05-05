import * as React from 'react';
import {View,Text, StyleSheet,TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({details, navigation, route}) =>{
    
  
    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={()=> navigation.navigate('Account',{userDetails: route.params.details})}>
                <View style={styles.itemContainer}>
                    <View style={styles.itemWrapper}>
                        <Icon name='account-cog' size={25} style={styles.itemIcon} />
                        <Text style={styles.itemName}>Account</Text>
                    </View>
                    <AntdIcon name='right' size={18} color="#2A2B2F"/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('API')}>
                <View style={styles.itemContainer}>
                    <View style={styles.itemWrapper}>
                        <AntdIcon name='API' size={25} style={styles.itemIcon} />
                        <Text style={styles.itemName}>API Calls</Text>
                    </View>
                    <AntdIcon name='right' size={18}  color="#2A2B2F"/>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:  '#fff'
    },
    itemContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemWrapper:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2A2B2F'
    },
    itemIcon: {
        marginRight: 20,
        color: '#2A2B2F'
    }
})

export default Settings;