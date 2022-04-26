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


const Tab = createBottomTabNavigator();

const Home = () => {
    return (
     
        <Tab.Navigator  initialRouteName="Calendar">
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
                component={Group} 
                options={{
                    headerShown:false,
                    tabBarLabel: 'Messaging',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="chat" color={color} size={size} />
                    ),
                }}/>
             <Tab.Screen 
                name="Settings" 
                component={Group} 
                options={{
                    headerShown:false,
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <IonIcon name="settings" color={color} size={size} />
                    ),
                }}/>
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