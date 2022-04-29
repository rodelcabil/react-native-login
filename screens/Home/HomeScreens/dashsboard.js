import React, {ReactNode, useEffect, useState} from 'react';
import { StyleSheet, View, Text, Button, Image, TouchableOpacity, DatePicker} from 'react-native';
import AppBar from '../../ReusableComponents/AppBar';

const Dashboard = () => {

    return (
        <View>
            <AppBar title={"Dashboard"} showMenuIcon={false} />


        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#075DA7',
    },

});

export default Dashboard;
