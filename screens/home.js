/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Agenda } from 'react-native-calendars'

const Home = () => {

    const [items, setItems] = useState({
        '2022-04-20': [{ name: 'item 1', agenda: 'any' }],
        '2022-04-23': [{ name: 'item 2', agenda: 'none' }],
        '2022-04-25': [{ name: 'item 3', agenda: 'any' }, { name: 'item 4', agenda: 'any' }],
        '2022-04-26': [{ name: 'item 1', agenda: 'any' }],
        '2022-04-27': [{ name: 'item 1', agenda: 'any' }],
        '2022-04-28': [{ name: 'item 1', agenda: 'any' }],
        '2022-04-29': [{ name: 'item 1', agenda: 'any' }],
        '2022-04-30': [{ name: 'item 1', agenda: 'any' }],
    });

    const renderItems = (item) => {
        return (
            <View style={styles.itemContainer}>
                <Text>{item.name}</Text>
                <Text>{item.agenda}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Agenda
                items={items}
                renderItem={renderItems}
                selected={'2022-04-25'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    itemContainer:{
        marginTop: 30,
        marginVertical: 10,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    }
});

export default Home;