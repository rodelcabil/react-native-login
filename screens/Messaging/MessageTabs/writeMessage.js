import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { Avatar, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AppBar from '../../ReusableComponents/AppBar';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';

const WriteMessage = ({route, navigation}) => {

    const [userList, setUserList] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [loader, setLoader] = useState(true)
    const [searchQuery, setSearchQuery] = useState('');



    useEffect(() => {
        const getUserDetails = async () => {
            const value = await AsyncStorage.getItem('userDetails')
            const data = JSON.parse(value)

            setUserDetails(data)
        }

        const getUserList = async () => {

            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/users/${route.params.clientID}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                    const newList = response.data.filter(item => { return item.id !== route.params.userID });
                    let sort = newList.sort(function (a, b) {
                        return new Date(b.updated_at).getTime() < new Date(a.updated_at).getTime() ? 1 : -1;
                    });
                    // console.log("USER DETAILS: ", sort)
                    setUserList(sort)
                    setLoader(false);


                })

        }

        getUserDetails();
        getUserList()
    }, [])

    const getInitials = (first_name, last_name) => {
        return first_name?.charAt(0).toUpperCase() + last_name?.charAt(0).toUpperCase();
    }
    const onChangeSearch = query => setSearchQuery(query);

    const newList = searchQuery === "" ? userList : userList.filter(item => { return String(item.name.toUpperCase()).includes(searchQuery.toUpperCase()) });

    return (
        loader === true ? <View style={{ height: '100%', justifyContent: 'center', flex:1, backgroundColor:'#fff' }}><LoaderSmall /></View> :
        <View style={styles.container}>
            <AppBar title="Write New Message" showMenuIcon={true} />
            <View style={{ backgroundColor: '#fff', }} >
                <Searchbar
                    style={{ width: Dimensions.get('window').width - 20, alignSelf: 'center', marginBottom: 10, shadowOpacity: 0, elevation: 0, backgroundColor: '#e3e3e3' }}
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    inputStyle={{ fontSize: 15 }}
                    autoFocus={false}
                  

                />
            </View>
            <ScrollView>
                <View style={styles.body}>
                    {newList.map((item, i) => {
                        return <TouchableOpacity
                            key={i}
                            activeOpacity={0.6}
                            onPress={() => {
                                navigation.navigate('Single Chat Client', {
                                    user_name: item.first_name + ' ' + item.last_name,
                                    first_name: item.first_name,
                                    last_name: item.last_name,
                                    id: item.id,
                                    type: 'user'
                                });

                            }}
                        >
                            <View style={styles.rowContainer}>
                                <Avatar.Text size={45} label={getInitials(item.first_name, item.last_name)} style={styles.avatar} />
                                <View style={styles.columnContainer}>
                                    <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
                                    <Text style={styles.message}>{item.email_address}</Text>
                                </View>
                                {/* <Text style={styles.date}>{moment(new Date(Date.now())).format("YYYY-MM-DD")}</Text> */}
                                <View style={{ width: 50 }} />
                            </View>
                        </TouchableOpacity>
                    })}

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
    body: {
        flex: 1,
        padding: 10,
        // backgroundColor: 'orange'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 10
    },
    columnContainer: {
        justifyContent: 'center'
    },
    name: {
        fontSize: 15,
        width: 250,
        color: 'black'
    },
    message: {
        fontSize: 13,
        maxWidth: 250,
    },
    date: {
        fontSize: 11,
    },
    avatar: {
        backgroundColor: '#3a87ad'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        padding: 0,
        borderColor: '#fff',
        borderWidth: 2,
        backgroundColor: '#3a87ad',
        shadowColor: 'black',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
})

export default WriteMessage