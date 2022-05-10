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
import ChatClientClass from '../ChatClientClass';
import ChatClient from '../chatClient';
import Settings from './HomeScreens/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const Home = ({route}) => {
    // const {details } = route.params
    // AsyncStorage.setItem('userDetails', JSON.stringify(details))
    // const getUserDetails = AsyncStorage.getItem('userDetails');
    // // const parsedData = JSON.parse(getUserDetails);
    const [userDetails, setUserDetails] = React.useState([])
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
            if(token !== null){
                setToken(token)
             }
        }

        getUserDetails();
        getToken();
    },[])

    return (
     
        <Tab.Navigator  initialRouteName="Dashboard">
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
                // component={ChatClientClass} 
                options={{
                    headerShown:false,
                    tabBarLabel: 'Messaging',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="chat" color={color} size={size} />
                    ),
                }} >
                  {props => <ChatClient name="Rodel"/> }
                
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