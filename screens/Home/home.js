import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import Calendar from './HomeScreens/calendar';
import Dashboard from './HomeScreens/dashsboard';
import Group from './HomeScreens/group';
import ChatClientClass from '../Messaging/ChatClientClass';
import ChatClient from '../chatClient';
import Settings from './HomeScreens/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatList from '../Messaging/ChatList';
import { Badge } from 'react-native-paper';


const Tab = createBottomTabNavigator();

const Home = ({navigation, route}) => {
    // const {details } = route.params
    // AsyncStorage.setItem('userDetails', JSON.stringify(details))
    // const getUserDetails = AsyncStorage.getItem('userDetails');
    // // const parsedData = JSON.parse(getUserDetails);
    const [userDetails, setUserDetails] = React.useState([]);
    const [notifCount, setNotifCount] = React.useState(1);
    const [token, setToken] = React.useState()

    React.useEffect(()=>{
        const getUserDetails = async () =>{
            const value = await AsyncStorage.getItem('userDetails')
            if(value !== null){
               setUserDetails(JSON.parse(value))
               console.log("HOME - USER DETAILS: ", value)
            }
        }
        const getToken = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            if(tokenget !== null){
                setToken(tokenget)
             }
        }

        getUserDetails();
        getToken();
    },[])

    return (
     
        <Tab.Navigator  initialRouteName="Dashboard" >
            <Tab.Screen name="Dashboard" component={Dashboard} 
                 options={{
                    headerShown:false,
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="view-dashboard" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Calendar" 
                component={Calendar} 
                initialParams={{token: route.params.token}}
                options={{
                    headerShown:false,
                    tabBarLabel: 'My Calendar',
                    tabBarIcon: ({ color, size }) => (
                        <FAIcon name="calendar-alt" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen 
                name="Messaging" 
                // component={ChatList} 
                options={{
                    // tabBarBadge: 3,
                    headerShown:false,
                    tabBarLabel: 'Messaging',
                    tabBarIcon: ({ color, size }) => (
                        <>
                        <Badge size={25} style={{position: 'relative', marginTop: -12, marginRight: 13, borderWidth: notifCount === 0 ? 0 :  3, borderColor:'#fff', zIndex: 100, display: notifCount === 0 ?  'none' : 'flex' }}>{notifCount}</Badge>
                        <Icon name="chat" color={color} size={30} style={{position: 'absolute', marginRight: 10, }}/>
                        </>
                    ),
                }} >
                    {/* {props => <ChatClient name={userDetails.first_name + ' ' + userDetails.last_name} /> } */}
                    {props => <ChatList clientID={userDetails.client_id} userID={userDetails.id} navigation={navigation}/> }
                
            </Tab.Screen>
             <Tab.Screen 
                name="Settings" 
                component={Settings} 
                initialParams={{details: userDetails}}
                options={{
                    headerShown:false,
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <IonIcon name="settings" color={color} size={size} />
                    ),
                }}>
                 {/* {props => <Settings details={userDetails}/> } */}
                </Tab.Screen>
            <Tab.Screen 
                name="Help" 
                component={Group} 
                options={{
                    headerShown:false,
                    tabBarLabel: 'Help',
                    tabBarIcon: ({ color, size }) => (
                        <EntypoIcon name="help-with-circle" color={color} size={size} />
                    ),
                }}/>
        </Tab.Navigator>
       
    );
};  

export default Home;